
import { Product } from '../../models/index.js';  

describe('Product Model', () => {
  it('should create a product with all attributes', async () => {
    const productData = {
      name: 'Test Product',
      price: '100',
      description: 'This is a test product',
      image: '/uploads/test-image.jpg', 
    };

    const product = await Product.create(productData);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe(productData.name);
    expect(product.price).toBe(productData.price);
    expect(product.description).toBe(productData.description);
    expect(product.image).toBe(productData.image);
  });

  it('should not create a product without required attributes', async () => {
    const productData = {
      name: '',
      price: '',
      description: '',
      image: null,
    };

    await expect(Product.create(productData)).rejects.toThrowError(
      new Error('notNull Violation: Product.name cannot be null')
    );
  });
});
