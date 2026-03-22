import axios from 'axios';

const API_URL = '/api/products/';

// Get all products
const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// Get single product
const getProduct = async (productId) => {
  const response = await axios.get(API_URL + productId);
  return response.data.data;
};

// Create new product
const createProduct = async (productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(API_URL, productData, config);
  return response.data.data;
};

// Update product
const updateProduct = async (productId, productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + productId, productData, config);
  return response.data.data;
};

// Delete product
const deleteProduct = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.delete(API_URL + productId, config);
  return response.data;
};

const productService = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService;