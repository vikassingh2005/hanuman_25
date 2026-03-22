const express = require('express');
const { globalSearch } = require('../controllers/search.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Search routes
router.route('/').get(globalSearch);

module.exports = router;