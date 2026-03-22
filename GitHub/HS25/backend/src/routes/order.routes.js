const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  createPaymentIntentForOrder
} = require('../controllers/order.controller');

const Order = require('../models/order.model');
const advancedResults = require('../utils/advancedResults');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.route('/myorders').get(getMyOrders);
router.route('/:id/payment-intent').post(createPaymentIntentForOrder);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/').post(createOrder);
router.route('/:id').get(getOrderById);

// Admin routes
router.use(authorize('admin'));
router.route('/').get(advancedResults(Order, 'user'), getOrders);
router.route('/:id/deliver').put(updateOrderToDelivered);

module.exports = router;