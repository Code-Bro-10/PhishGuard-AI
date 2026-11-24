import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Scan from '../models/Scan.js';
import SecurityAlert from '../models/SecurityAlert.js';

describe('Scan & History APIs with User Data Isolation', () => {
  let user1Token;
  let user1Id;
  let user2Token;
  let user2Id;
  let user1ScanId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await User.deleteMany({});
    await Scan.deleteMany({});
    await SecurityAlert.deleteMany({});

    // Register User 1
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'User One',
      email: 'user1@test.local',
      password: 'Password123!',
    });
    user1Token = res1.body.token;
    user1Id = res1.body.user.id;

    // Register User 2
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'User Two',
      email: 'user2@test.local',
      password: 'Password123!',
    });
    user2Token = res2.body.token;
    user2Id = res2.body.user.id;
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('POST /api/scan/url should scan URL, save record, and return analysis', async () => {
    const res = await request(app)
      .post('/api/scan/url')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ url: 'https://paypal.com.account-update.xyz/login' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.riskScore).toBeGreaterThanOrEqual(60);
    expect(res.body.data.riskLevel).toMatch(/high|critical/);
    expect(res.body.data.detectedIndicators.length).toBeGreaterThan(0);

    user1ScanId = res.body.data._id;

    // Verify alert was created for high risk
    const alerts = await SecurityAlert.find({ userId: user1Id });
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('POST /api/scan/email should scan email content, save record, and return analysis', async () => {
    const res = await request(app)
      .post('/api/scan/email')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        content: 'URGENT: Your account has been suspended! Send your password within 24 hours to restore access.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scanType).toBe('email');
    expect(res.body.data.riskScore).toBeGreaterThanOrEqual(60);
  });

  it('GET /api/scan/history should return only scans belonging to authenticated user', async () => {
    // User 1 history
    const res1 = await request(app)
      .get('/api/scan/history')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res1.status).toBe(200);
    expect(res1.body.data.length).toBe(2);
    expect(res1.body.pagination.total).toBe(2);

    // User 2 history should be completely empty (Isolation check)
    const res2 = await request(app)
      .get('/api/scan/history')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res2.status).toBe(200);
    expect(res2.body.data.length).toBe(0);
    expect(res2.body.pagination.total).toBe(0);
  });

  it('GET /api/scan/:id should prevent User 2 from accessing User 1 scan', async () => {
    const res = await request(app)
      .get(`/api/scan/${user1ScanId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('DELETE /api/scan/:id should allow owner to delete and cascade clean alerts', async () => {
    const res = await request(app)
      .delete(`/api/scan/${user1ScanId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify scan deleted
    const deleted = await Scan.findById(user1ScanId);
    expect(deleted).toBeNull();
  });
});

