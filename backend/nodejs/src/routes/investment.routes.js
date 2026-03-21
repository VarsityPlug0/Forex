const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ investments: [], message: 'List investments - coming soon' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create investment - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get investment ${req.params.id} - coming soon` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Close investment ${req.params.id} - coming soon` });
});

module.exports = router;
