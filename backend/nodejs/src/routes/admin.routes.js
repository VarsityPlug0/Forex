const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { User, BlogPost, Course, Lesson, PammGroup, Investment, UserProgress, Announcement } = require('../models');
const { sequelize } = require('../config/database');

const router = express.Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin);

// GET /dashboard — aggregated stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalPosts, publishedPosts, totalCourses, totalLessons,
      totalGroups, activeInvestments, totalAnnouncements] = await Promise.all([
      User.count(),
      User.count({ where: { is_active: true } }),
      BlogPost.count(),
      BlogPost.count({ where: { is_published: true } }),
      Course.count(),
      Lesson.count(),
      PammGroup.count({ where: { is_active: true } }),
      Investment.count({ where: { status: 'active' } }),
      Announcement.count({ where: { is_active: true } }),
    ]);

    // Recent user signups (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.count({ where: { created_at: { [require('sequelize').Op.gte]: thirtyDaysAgo } } });

    // Lesson completions
    const lessonCompletions = await UserProgress.count({ where: { completed: true } });

    res.json({
      stats: {
        users: { total: totalUsers, active: activeUsers, recentSignups },
        content: { totalPosts, publishedPosts, totalCourses, totalLessons, lessonCompletions },
        pamm: { totalGroups, activeInvestments },
        announcements: totalAnnouncements,
      },
    });
  } catch (err) { next(err); }
});

// GET /users — full user list
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const where = {};
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash', 'verification_token', 'reset_token'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({ users: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
});

// PATCH /users/:id/role
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'premium', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ role });
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

// PATCH /users/:id/status
router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const { is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ is_active });
    res.json({ user: { id: user.id, email: user.email, is_active: user.is_active } });
  } catch (err) { next(err); }
});

// GET /blog — all posts (including drafts)
router.get('/blog', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { rows, count } = await BlogPost.findAndCountAll({
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    res.json({ posts: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
});

// GET /courses — all courses including unpublished
router.get('/courses', async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Lesson, as: 'lessons', attributes: ['id', 'title', 'is_published'] },
      ],
      order: [['sort_order', 'ASC']],
    });
    res.json({ courses });
  } catch (err) { next(err); }
});

module.exports = router;
