const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Auth user & get token (login with username or email)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Please provide identifier and password' });
  }

  try {
    const user = await User.findByCredentials(identifier, password);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Create admin user (run once)
// @route   POST /api/auth/create-admin
// @access  Public
const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists by username or email
    const userExists = await User.findOne({
      $or: [
        { username },
        { email }
      ].filter(obj => Object.values(obj)[0] !== undefined)
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create default admin from env
// @route   POST /api/auth/create-default-admin
// @access  Public
const createDefaultAdmin = async (req, res) => {
  try {
    const adminEmail = process.env.EMAIL_USER || 'admin@example.com';
    const adminPassword = 'Nikunj@2004';
    const adminUsername = 'Nikunj rana';
    
    // Check if user exists by username or email
    const userExists = await User.findOne({
      $or: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    });
    
    if (userExists) {
      return res.status(400).json({ 
        message: 'Admin already exists',
        username: userExists.username,
        email: userExists.email
      });
    }

    const user = await User.create({ 
      username: adminUsername, 
      email: adminEmail, 
      password: adminPassword 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        message: 'Admin created successfully'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide email address' });
  }

  try {
    // First check if email exists in database
    const user = await User.findOne({ email });

    // If email doesn't exist, return error
    if (!user) {
      return res.status(400).json({ message: 'User not valid' });
    }

    // Email exists - generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore.set(email, { otp, expiresAt });

    // Send email with OTP
    try {
      const transporter = createTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP - Admin Portal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 5 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });

      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (emailError) {
      console.error('Email error:', emailError);
      return res.status(500).json({ message: 'Failed to send email. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Please provide email and OTP' });
  }

  try {
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new OTP.' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified successfully
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Please provide email, OTP and new password' });
  }

  try {
    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new OTP.' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find user and update password
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    // Clear OTP
    otpStore.delete(email);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  login, 
  getMe, 
  createAdmin, 
  createDefaultAdmin,
  forgotPassword, 
  verifyOTP, 
  resetPassword 
};

