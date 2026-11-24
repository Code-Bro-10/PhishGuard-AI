import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Scan from '../models/Scan.js';
import SecurityAlert from '../models/SecurityAlert.js';

describe('Dashboard, Analytics & User Profile APIs', () => {
  let token;
  let userId;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await User.deleteMany({});
    await Scan.deleteMany({});
    await SecurityAlert.deleteMany({});

    const authRes = await request(app).post('/api/auth/register').send({
      name: 'Cyber Auditor',
      email: 'auditor@phishguard.test',
      password: 'AuditPassword123!',
    });
    token = authRes.body.token;
    userId = authRes.body.user.id;

    // Seed realistic database records for statistical calculation
    await Scan.create([
      {
        userId,
        scanType: 'url',
        originalInput: 'https://example.com',
        normalizedInput: 'https://example.com',
        riskScore: 5,
        riskLevel: 'low',
        detectedIndicators: [],
        recommendations: ['Safe'],
      },
      {
        userId,
        scanType: 'url',
        originalInput: 'http://suspicious-verify.xyz/login',
        normalizedInput: 'http://suspicious-verify.xyz/login',
        riskScore: 75,
        riskLevel: 'high',
        detectedIndicators: [
          {
            id: 'brand-test',
            category: 'Brand Protection',
            severity: 'high',
            title: 'Test',
            description: 'Test',
            explanation: 'Test',
            scoreImpact: 75,
          },
        ],
        recommendations: ['Caution'],
      },
      {
        userId,
        scanType: 'email',
        originalInput: 'Urgent wire transfer required immediately.',
        normalizedInput: 'Urgent wire transfer...',
        riskScore: 65,
        riskLevel: 'high',
        detectedIndicators: [],
        recommendations: ['Verify'],
      },
    ]);
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /api/dashboard/stats should compute metrics from real database documents', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalScans).toBe(3);
    expect(res.body.data.totalUrlsScanned).toBe(2);
    expect(res.body.data.safeUrls).toBe(1);
    expect(res.body.data.highRiskUrls).toBe(1);
    expect(res.body.data.totalEmailsAnalyzed).toBe(1);
    expect(res.body.data.averageRiskScore).toBeGreaterThan(0);
  });

  it('GET /api/dashboard/activity should return weekly trend and recent records', async () => {
    const res = await request(app)
      .get('/api/dashboard/activity')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.weeklyTrend.length).toBe(7);
    expect(res.body.data.recentScans.length).toBe(3);
  });

  it('GET /api/dashboard/threat-distribution should categorize risks and types', async () => {
    const res = await request(app)
      .get('/api/dashboard/threat-distribution')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.byRiskLevel.length).toBe(4);
    expect(res.body.data.byScanType.length).toBe(2);
  });

  it('PATCH /api/users/profile should update user display name', async () => {
    const res = await request(app)
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Chief Security Officer' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Chief Security Officer');
  });

  it('PATCH /api/users/change-password should verify old password and update hash', async () => {
    const res = await request(app)
      .patch('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'AuditPassword123!',
        newPassword: 'BrandNewSecurePassword456!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

