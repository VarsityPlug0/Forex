const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.json({ message: 'Get profile - coming soon' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update profile - coming soon' });
});

router.get('/', (req, res) => {
  res.json({ message: 'List users - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} - coming soon` });
});

module.exports = router;
