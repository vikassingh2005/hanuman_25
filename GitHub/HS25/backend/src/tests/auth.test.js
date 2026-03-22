const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user.model');

// Sample user data for testing
const testUser = {
  name: 'Auth Test User',
  email: 'authtest@example.com',
  password: 'password123'
};

let token;

// After all tests, clean up the database
afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  // Test user registration
  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  // Test user login
  test('Should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    
    token = res.body.token;
  });

  // Test get current user
  test('Should get current user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  // Test unauthorized access
  test('Should not allow access to protected route without token', async () => {
    const res = await request(app)
      .get('/api/auth/me');

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  // Test invalid token
  test('Should not allow access with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});