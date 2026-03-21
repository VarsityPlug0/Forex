const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ accounts: [], message: 'List PAMM accounts - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get PAMM account ${req.params.id} - coming soon` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create PAMM account - coming soon' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update PAMM account ${req.params.id} - coming soon` });
});

module.exports = router;
