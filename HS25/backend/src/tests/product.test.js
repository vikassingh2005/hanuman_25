const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/product.model');

// Sample product data for testing
const testProduct = {
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  brand: 'Test Brand',
  category: 'Test Category',
  countInStock: 10
};

let token;
let productId;

// Before all tests, connect to the database and create a test user
beforeAll(async () => {
  // Register a test user and get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

  token = res.body.token;
});

// After all tests, clean up the database
afterAll(async () => {
  await Product.deleteMany({});
  await mongoose.connection.close();
});

describe('Product API', () => {
  // Test creating a product
  test('Should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(testProduct);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(testProduct.name);
    
    productId = res.body.data._id;
  });

  // Test getting all products
  test('Should get all products', async () => {
    const res = await request(app)
      .get('/api/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Test getting a single product
  test('Should get a single product by ID', async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(productId);
  });

  // Test updating a product
  test('Should update a product', async () => {
    const updatedData = {
      name: 'Updated Product',
      price: 129.99
    };

    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(updatedData.name);
    expect(res.body.data.price).toBe(updatedData.price);
  });

  // Test product search functionality
  test('Should search products by name', async () => {
    const res = await request(app)
      .get('/api/products?search=Updated');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].name).toContain('Updated');
  });

  // Test product pagination
  test('Should paginate products', async () => {
    const res = await request(app)
      .get('/api/products?page=1&limit=10');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
  });

  // Test deleting a product
  test('Should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});