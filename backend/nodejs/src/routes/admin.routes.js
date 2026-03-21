const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard - coming soon' });
});

router.get('/users', (req, res) => {
  res.json({ users: [], message: 'Admin user list - coming soon' });
});

router.put('/users/:id/status', (req, res) => {
  res.json({ message: `Update user ${req.params.id} status - coming soon` });
});

module.exports = router;
