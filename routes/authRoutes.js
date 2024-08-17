const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', authController.login);

// Handle logout
router.get('/logout', authController.logout);

// Render forgot password form
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Render reset password form (optional, for server-side rendered apps)
router.get('/reset-password/:token', (req, res) => {
  res.render('reset-password', { token: req.params.token });
});

// Handle password reset
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
