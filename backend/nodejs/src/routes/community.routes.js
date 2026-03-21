const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { CommunityChannel, ForumCategory, ForumTopic, Announcement, User } = require('../models');

const router = express.Router();

// ── Channels ──
router.get('/channels', async (req, res, next) => {
  try {
    const channels = await CommunityChannel.findAll({
      where: { is_active: true, is_public: true },
      order: [['sort_order', 'ASC']],
    });
    res.json({ channels });
  } catch (err) { next(err); }
});

// ── Announcements ──
router.get('/announcements', async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      where: { is_active: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'full_name'] }],
      order: [['is_pinned', 'DESC'], ['published_at', 'DESC']],
      limit: 20,
    });
    res.json({ announcements });
  } catch (err) { next(err); }
});

router.post('/announcements', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const a = await Announcement.create({ ...req.body, author_id: req.user.id });
    res.status(201).json({ announcement: a });
  } catch (err) { next(err); }
});

router.put('/announcements/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const a = await Announcement.findByPk(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    await a.update(req.body);
    res.json({ announcement: a });
  } catch (err) { next(err); }
});

// ── Forum ──
router.get('/forum/categories', async (req, res, next) => {
  try {
    const categories = await ForumCategory.findAll({ where: { is_active: true }, order: [['sort_order', 'ASC']] });
    res.json({ categories });
  } catch (err) { next(err); }
});

router.get('/forum/topics', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const where = {};
    if (category) where.category_id = category;

    const { rows, count } = await ForumTopic.findAndCountAll({
      where,
      include: [
        { model: ForumCategory, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar_url'] },
      ],
      order: [['is_pinned', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({ topics: rows, total: count });
  } catch (err) { next(err); }
});

router.post('/forum/topics', requireAuth, async (req, res, next) => {
  try {
    const topic = await ForumTopic.create({ ...req.body, author_id: req.user.id });
    res.status(201).json({ topic });
  } catch (err) { next(err); }
});

module.exports = router;
