const Product = require('../models/product.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async.middleware');
const { applySearch } = require('../utils/search');

/**
 * @desc    Get all products with pagination and filtering
 * @route   GET /api/products
 * @access  Public
 * @example GET /api/products?category=badminton&price[gte]=100&price[lte]=1000&sort=-price&page=1&limit=10
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  // If advancedResults middleware is used
  if (res.advancedResults) {
    return res.status(200).json(res.advancedResults);
  }
  
  // Apply search if search parameter exists
  let query;
  if (req.query.search) {
    const searchableFields = ['name', 'brand', 'category'];
    query = applySearch(Product, req.query, searchableFields);
  } else {
    query = Product.find();
  }
  
  const products = await query;
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};