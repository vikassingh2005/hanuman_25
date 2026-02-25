const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { 
  register, 
  login, 
  getMe, 
  updateDetails, 
  updatePassword 
} = require('../controllers/auth.controller');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // continue registration
};

// Register user
router.post(
  '/register',
  [
    body('firstname', 'First name is required').not().isEmpty(),
    body('lastname', 'Last name is required').not().isEmpty(),
    body('email', 'Please include a valid email').not().isEmpty.isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('comfirmPassword', 'Confirm password must match password').custom((value, { req }) => value === req.body.password),
    body('phone', 'Phone number cannot be longer than 10 characters').isLength({ max: 10 }),
  ],
  register
);

// Login user
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  login
);

// Get current logged in user
router.get('/me', protect, getMe);

// Update user details
router.put('/updatedetails', protect, updateDetails);

// Update password
router.put(
  '/updatepassword',
  [
    body('currentPassword', 'Current password is required').not().isEmpty(),
    body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  protect,
  updatePassword
);

module.exports = router;