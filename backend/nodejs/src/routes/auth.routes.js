const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - coming soon' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - coming soon' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - coming soon' });
});

router.post('/refresh-token', (req, res) => {
  res.json({ message: 'Refresh token endpoint - coming soon' });
});

router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Forgot password endpoint - coming soon' });
});

router.post('/reset-password', (req, res) => {
  res.json({ message: 'Reset password endpoint - coming soon' });
});

module.exports = router;
