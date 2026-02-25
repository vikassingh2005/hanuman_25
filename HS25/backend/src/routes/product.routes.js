const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');

const {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage
} = require('../controllers/upload.controller');

const Product = require('../models/product.model');
const advancedResults = require('../utils/advancedResults');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .get(advancedResults(Product, 'user'), getProducts)
  .post(protect, authorize('admin'), createProduct);

// Image upload routes
router
  .route('/:id/image')
  .put(protect, authorize('admin'), uploadProductImage);

router
  .route('/:id/images')
  .put(protect, authorize('admin'), uploadProductImages);

router
  .route('/:id/images/:imageId')
  .delete(protect, authorize('admin'), deleteProductImage);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;