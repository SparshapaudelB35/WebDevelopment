import request from 'supertest';
import express from 'express';
import { productRouter } from '../../routes/productRoute'; 
import { sequelize } from '../../database/index';  

const app = express();
app.use(express.json());
app.use('/products', productRouter);

beforeAll(async () => {
  await sequelize.sync({ force: true });  
});

describe('Product Routes', () => {
  let productId;

  it('should add a product via the route', async () => {
    const productData = {
      name: 'Route Test Product',
      price: '150',
      description: 'A product added via route testing',
    };

    const res = await request(app)
      .post('/products')
      .attach('image', path.join(__dirname, 'test-image.jpg'))  
      .field('name', productData.name)
      .field('price', productData.price)
      .field('description', productData.description);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(productData.name);
    expect(res.body.data.price).toBe(productData.price);
    expect(res.body.data.description).toBe(productData.description);

    productId = res.body.data.id;
  });

  it('should get a product by ID via the route', async () => {
    const res = await request(app).get(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toBe(productId);
  });

  it('should update a product via the route', async () => {
    const updateData = {
      name: 'Updated Route Product',
      price: '180',
      description: 'This product was updated via route',
    };

    const res = await request(app)
      .put(`/products/${productId}`)
      .attach('image', path.join(__dirname, 'test-image.jpg'))  
      .field('name', updateData.name)
      .field('price', updateData.price)
      .field('description', updateData.description);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(updateData.name);
    expect(res.body.data.price).toBe(updateData.price);
    expect(res.body.data.description).toBe(updateData.description);
  });

  it('should delete a product via the route', async () => {
    const res = await request(app).delete(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });
});
