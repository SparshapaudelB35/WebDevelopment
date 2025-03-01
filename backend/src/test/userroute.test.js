
import request from 'supertest';
import express from 'express';
import { userRouter } from '../../routes/userRoute';  
import { sequelize } from '../../database/index'; 

const app = express();
app.use(express.json());
app.use('/users', userRouter);

beforeAll(async () => {
  await sequelize.sync({ force: true });  
});

describe('User Routes', () => {
  let userId;

  it('should create a user through the route', async () => {
    const userData = {
      name: 'Test Route User',
      email: 'routetest@example.com',
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
  });

  it('should get a user by ID through the route', async () => {
    const res = await request(app).get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toBe(userId);
    expect(res.body.data).not.toHaveProperty('password'); 
  });
});
