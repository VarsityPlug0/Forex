const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ posts: [], message: 'List blog posts - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get post ${req.params.id} - coming soon` });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create post - coming soon' });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update post ${req.params.id} - coming soon` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete post ${req.params.id} - coming soon` });
});

module.exports = router;
