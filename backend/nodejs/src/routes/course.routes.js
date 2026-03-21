const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ courses: [], message: 'List courses - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get course ${req.params.id} - coming soon` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create course - coming soon' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update course ${req.params.id} - coming soon` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete course ${req.params.id} - coming soon` });
});

module.exports = router;
