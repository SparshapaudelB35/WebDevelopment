import request from 'supertest';
import express from 'express';
import { productController } from '../../controller/index'; 
import { Product } from '../../models/index.js';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(express.json());

// Mock the upload middleware with a mock file
app.post('/products', multer().single('image'), productController.add);
app.put('/products/:id', multer().single('image'), productController.update);
app.get('/products/:id', productController.getById);
app.delete('/products/:id', productController.deleteById);

beforeAll(async () => {
  await Product.sync({ force: true });  // Sync the database before testing
});

describe('ProductController', () => {
  let productId;

  it('should add a product with image', async () => {
    const productData = {
      name: 'Test Product',
      price: '100',
      description: 'This is a test product',
    };

    const res = await request(app)
      .post('/products')
      .attach('image', path.join(__dirname, 'test-image.jpg'))  // Mock image
      .field('name', productData.name)
      .field('price', productData.price)
      .field('description', productData.description);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(productData.name);
    expect(res.body.data.price).toBe(productData.price);
    expect(res.body.data.description).toBe(productData.description);
    expect(res.body.data.image).toBeTruthy();

    productId = res.body.data.id;
  });

  it('should get a product by ID', async () => {
    const res = await request(app).get(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toBe(productId);
  });

  it('should update a product', async () => {
    const updateData = {
      name: 'Updated Product',
      price: '120',
      description: 'This product has been updated',
    };

    const res = await request(app)
      .put(`/products/${productId}`)
      .attach('image', path.join(__dirname, 'test-image.jpg'))  // Mock image
      .field('name', updateData.name)
      .field('price', updateData.price)
      .field('description', updateData.description);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(updateData.name);
    expect(res.body.data.price).toBe(updateData.price);
    expect(res.body.data.description).toBe(updateData.description);
  });

  it('should delete a product', async () => {
    const res = await request(app).delete(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');
  });
});
