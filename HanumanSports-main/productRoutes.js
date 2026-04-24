const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Fetch all sports products for the shop
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;