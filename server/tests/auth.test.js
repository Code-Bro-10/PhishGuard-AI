import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';

describe('Authentication & Health APIs', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /api/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('POST /api/auth/register should create new user and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sec Analyst',
        email: 'analyst@phishguard.test',
        password: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('analyst@phishguard.test');
  });

  it('POST /auth/register (without /api prefix) should route properly and create user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Root Alias User',
        email: 'rootalias@phishguard.test',
        password: 'Password123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/register should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'analyst@phishguard.test',
        password: 'Password123!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register should validate minimum password length', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Short Pass',
        email: 'short@phishguard.test',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 6 characters/i);
  });

  it('POST /api/auth/login should authenticate valid user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'analyst@phishguard.test',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login should reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'analyst@phishguard.test',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me should return user details when token is valid', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'analyst@phishguard.test',
        password: 'Password123!',
      });

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('analyst@phishguard.test');
  });

  it('GET /api/auth/me should reject request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

