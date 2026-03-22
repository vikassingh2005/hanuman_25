const asyncHandler = require('../middleware/async.middleware');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const { buildSearchQuery } = require('../utils/search');

/**
 * @desc    Global search across multiple collections
 * @route   GET /api/search
 * @access  Private/Admin
 */
exports.globalSearch = asyncHandler(async (req, res, next) => {
  const { search, type } = req.query;
  
  if (!search) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  let results = {};
  const searchableFields = {
    products: ['name', 'description', 'brand', 'category'],
    users: ['name', 'email'],
    orders: ['_id', 'status']
  };

  // Search products
  if (!type || type === 'products') {
    const productQuery = buildSearchQuery({ search }, searchableFields.products);
    const products = await Product.find(productQuery).limit(10);
    results.products = products;
  }

  // Search users (admin only)
  if (req.user.role === 'admin' && (!type || type === 'users')) {
    const userQuery = buildSearchQuery({ search }, searchableFields.users);
    const users = await User.find(userQuery).select('-password').limit(10);
    results.users = users;
  }

  // Search orders (admin or own orders)
  if (!type || type === 'orders') {
    const orderQuery = buildSearchQuery({ search }, searchableFields.orders);
    
    // Regular users can only search their own orders
    if (req.user.role !== 'admin') {
      orderQuery.user = req.user.id;
    }
    
    const orders = await Order.find(orderQuery).limit(10);
    results.orders = orders;
  }

  res.status(200).json({
    success: true,
    data: results
  });
});