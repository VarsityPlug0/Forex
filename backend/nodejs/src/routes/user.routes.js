const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

// GET / — list users (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { full_name: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash', 'verification_token', 'reset_token'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ users: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
});

// GET /me/profile — own profile
router.get('/me/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash', 'verification_token', 'reset_token'] },
    });
    res.json({ user });
  } catch (err) { next(err); }
});

// PATCH /me — update own profile
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const allowedFields = ['full_name', 'bio', 'avatar_url'];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    await User.update(updates, { where: { id: req.user.id } });
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash', 'verification_token', 'reset_token'] },
    });
    res.json({ user });
  } catch (err) { next(err); }
});

module.exports = router;
