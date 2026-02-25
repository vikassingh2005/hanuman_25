const express = require('express');
const { trackEvent } = require('../utils/analytics');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST /api/analytics
// @desc    Track client-side analytics events
// @access  Public
router.post('/', (req, res) => {
  const { type, data } = req.body;
  
  // Add user info if available
  if (req.user) {
    data.userId = req.user.id;
  }
  
  // Add request metadata
  data.userAgent = req.get('user-agent');
  data.ip = req.ip;
  
  // Track the event
  trackEvent(`client:${type}`, data);
  
  res.status(200).json({ success: true });
});

module.exports = router;