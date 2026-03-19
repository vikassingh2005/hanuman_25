const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/profile.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

// Protected routes
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/avatar', protect, uploadAvatar);
router.put('/password', protect, changePassword);

// Public routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;