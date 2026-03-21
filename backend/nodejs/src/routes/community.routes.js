const express = require('express');
const router = express.Router();

router.get('/posts', (req, res) => {
  res.json({ posts: [], message: 'List community posts - coming soon' });
});

router.post('/posts', (req, res) => {
  res.json({ message: 'Create community post - coming soon' });
});

router.get('/posts/:id', (req, res) => {
  res.json({ message: `Get post ${req.params.id} - coming soon` });
});

router.post('/posts/:id/comments', (req, res) => {
  res.json({ message: 'Add comment - coming soon' });
});

module.exports = router;
