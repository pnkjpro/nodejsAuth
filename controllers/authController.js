// controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const passport = require('passport');
const User = require('../models/User');

// Handle login
exports.login = passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
  failureFlash: true
});

// Handle logout
exports.logout = (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};

// Request password reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      to: user.email,
      from: 'your-email@gmail.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://${req.headers.host}/auth/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Password reset email sent');
  } catch (err) {
    res.status(500).send('Error on the server');
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: Date.now()
        }
      }
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }

    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).send('Password has been reset');
  } catch (err) {
    res.status(500).send('Error on the server');
  }
};
