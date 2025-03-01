const request = require('supertest');
const app = require('../index.js');  // Your Express app
const { User } = require('../../models/index.js');  
const bcrypt = require('bcryptjs');


// Mock the JWT utility
jest.mock('../../security/jwt-util.js', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token'),
}));

describe('POST /api/auth/login', () => {
  let user;

  beforeAll(async () => {
    // Mock the user creation
    user = await User.create({
      email: 'testuser@example.com',
      password: bcrypt.hashSync('password123', 10),  // Use bcrypt to hash the password
      name: 'Test User',
    });
  });

  afterAll(async () => {
    // Clean up any created usersi
    await User.destroy({ where: {} });
  });

  it('should return 400 if email or password is not provided', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

  it('should return 404 if user is not found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistentuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should return 401 if password is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid password');
  });

  it('should return 200 and token if login is successful', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Successfully logged in');
    expect(res.body.data.token).toBe('mock-token');
    expect(res.body.data.role).toBe('user');
    expect(res.body.data.user.id).toBeDefined();
    expect(res.body.data.user.name).toBe('Test User');
    expect(res.body.data.user.email).toBe('testuser@example.com');
  });

  it('should assign admin role for admin@admin.com', async () => {
    const admin = await User.create({
      email: 'admin@admin.com',
      password: bcrypt.hashSync('adminpassword', 10),
      name: 'Admin User',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@admin.com',
        password: 'adminpassword',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('admin');
  });
});
