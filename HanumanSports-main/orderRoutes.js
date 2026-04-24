const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Checkout: Process the order and clear the cart
router.post('/checkout', auth, orderController.checkout);

module.exports = router;