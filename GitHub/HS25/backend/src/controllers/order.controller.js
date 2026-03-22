const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { createPaymentIntent, retrievePaymentIntent } = require('../utils/stripe');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  // Create order
  const order = await Order.create({
    orderItems,
    user: req.user.id,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  // Send order confirmation email
  try {
    const emailService = require('../utils/emailService');
    await emailService.sendOrderConfirmationEmail(order, req.user);
  } catch (err) {
    console.error('Order confirmation email could not be sent', err);
    // Don't stop order creation if email fails
  }

  res.status(201).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order owner or admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this order`, 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Verify payment with Stripe
  const { paymentIntentId } = req.body;
  
  if (!paymentIntentId) {
    return next(new ErrorResponse('Payment intent ID is required', 400));
  }

  const paymentIntent = await retrievePaymentIntent(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return next(new ErrorResponse('Payment not successful', 400));
  }

  // Update order
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Processing';
  order.paymentResult = {
    id: paymentIntent.id,
    status: paymentIntent.status,
    update_time: new Date().toISOString(),
    email_address: req.user.email
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

/**
 * @desc    Update order to delivered
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'Delivered';

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
exports.getOrders = asyncHandler(async (req, res, next) => {
  // If advancedResults middleware is used
  if (res.advancedResults) {
    return res.status(200).json(res.advancedResults);
  }

  const orders = await Order.find().populate('user', 'id name');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * @desc    Create payment intent
 * @route   POST /api/orders/:id/payment-intent
 * @access  Private
 */
exports.createPaymentIntentForOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order owner
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to pay for this order`, 401));
  }

  // Create payment intent
  const paymentIntent = await createPaymentIntent(
    order.totalPrice,
    'usd',
    {
      orderId: order._id.toString(),
      userId: req.user.id
    }
  );

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});