const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { Investment, PammGroup } = require('../models');

const router = express.Router();

// GET / — my investments
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const investments = await Investment.findAll({
      where: { user_id: req.user.id },
      include: [{ model: PammGroup, as: 'group', attributes: ['id', 'name', 'slug', 'strategy_type', 'risk_level'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ investments });
  } catch (err) { next(err); }
});

// POST / — new investment
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { pamm_group_id, amount } = req.body;
    const group = await PammGroup.findByPk(pamm_group_id);
    if (!group || !group.is_active || !group.is_open) {
      return res.status(400).json({ error: 'Group is not accepting investments' });
    }
    if (amount < group.minimum_investment) {
      return res.status(400).json({ error: `Minimum investment is $${group.minimum_investment}` });
    }

    const investment = await Investment.create({
      user_id: req.user.id, pamm_group_id, amount,
      current_value: amount, status: 'pending',
    });
    res.status(201).json({ investment });
  } catch (err) { next(err); }
});

module.exports = router;
