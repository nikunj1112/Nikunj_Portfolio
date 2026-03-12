
const express = require('express');
const router = express.Router();
const { login, getMe, createAdmin, createDefaultAdmin, forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/create-admin', createAdmin);
router.post('/create-default-admin', createDefaultAdmin);

// Forgot Password routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;

