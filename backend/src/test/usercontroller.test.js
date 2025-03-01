import request from 'supertest';
import express from 'express';
import { UserController } from '../../controller/index';  
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

// Simulate the routes
app.post('/users/create', UserController.create);
app.get('/users/:id', UserController.getById);

describe('UserController', () => {
  let userId;

  it('should create a user', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'user',
    };

    const res = await request(app).post('/users/create').send(userData);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(userData.name);
    expect(res.body.data.email).toBe(userData.email);
    expect(res.body.data.role).toBe(userData.role);

    userId = res.body.data.id;

    const user = await User.findByPk(userId);
    const isMatch = await bcrypt.compare(userData.password, user.password);
    expect(isMatch).toBe(true);
  });

  it('should get a user by ID (excluding password)', async () => {
    const res = await request(app).get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data.id).toBe(userId);
  });
});
