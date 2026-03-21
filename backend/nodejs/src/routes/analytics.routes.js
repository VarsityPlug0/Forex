const express = require('express');
const router = express.Router();

router.get('/overview', (req, res) => {
  res.json({
    activeTraders: 12400,
    winRate: 68,
    pammInvestors: 3200,
    message: 'Analytics overview',
  });
});

router.get('/performance', (req, res) => {
  res.json({ message: 'Performance analytics - coming soon' });
});

module.exports = router;
