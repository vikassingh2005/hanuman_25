const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToCart, getCart } = require('../controllers/cartController');

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);

module.exports = router;