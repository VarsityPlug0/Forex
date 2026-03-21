const express = require('express');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const { PammGroup, PammPerformance, DailyTrade, Investment } = require('../models');

const router = express.Router();

// GET / — public list
router.get('/', async (req, res, next) => {
  try {
    const groups = await PammGroup.findAll({
      where: { is_active: true },
      include: [{ model: PammPerformance, as: 'performance', order: [['date', 'DESC']], limit: 12 }],
      order: [['name', 'ASC']],
    });
    res.json({ groups });
  } catch (err) { next(err); }
});

// GET /:slug — single group
router.get('/:slug', async (req, res, next) => {
  try {
    const group = await PammGroup.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [
        { model: PammPerformance, as: 'performance', order: [['date', 'DESC']], limit: 30 },
        { model: DailyTrade, as: 'trades', where: { status: 'closed' }, order: [['closed_at', 'DESC']], limit: 20, required: false },
      ],
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Investor count
    const investorCount = await Investment.count({ where: { pamm_group_id: group.id, status: 'active' } });
    group.dataValues.investor_count = investorCount;

    res.json({ group });
  } catch (err) { next(err); }
});

// POST / — create group (admin)
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const group = await PammGroup.create(req.body);
    res.status(201).json({ group });
  } catch (err) { next(err); }
});

// PUT /:id — update group (admin)
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const group = await PammGroup.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    await group.update(req.body);
    res.json({ group });
  } catch (err) { next(err); }
});

// POST /:id/performance — log performance (admin)
router.post('/:id/performance', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const perf = await PammPerformance.create({ ...req.body, pamm_group_id: req.params.id });
    res.status(201).json({ performance: perf });
  } catch (err) { next(err); }
});

// POST /:id/trades — log trade (admin)
router.post('/:id/trades', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const trade = await DailyTrade.create({ ...req.body, pamm_group_id: req.params.id });
    res.status(201).json({ trade });
  } catch (err) { next(err); }
});

// GET /:id/trades — list recent trades
router.get('/:id/trades', async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const trades = await DailyTrade.findAll({
      where: { pamm_group_id: req.params.id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
    });
    res.json({ trades });
  } catch (err) { next(err); }
});

module.exports = router;
