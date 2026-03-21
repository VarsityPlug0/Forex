const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { User, BlogPost, UserProgress, Investment } = require('../models');
const { sequelize } = require('../config/database');

const router = express.Router();

router.use(requireAuth, requireAdmin);

// GET /overview — chart-ready analytics
router.get('/overview', async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    const now = new Date();

    // Users per month (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const usersPerMonth = await User.findAll({
      attributes: [
        [sequelize.fn('date_trunc', 'month', sequelize.col('created_at')), 'month'],
        [sequelize.fn('count', '*'), 'count'],
      ],
      where: { created_at: { [Op.gte]: sixMonthsAgo } },
      group: ['month'],
      order: [[sequelize.col('month'), 'ASC']],
      raw: true,
    });

    // Blog views (top posts)
    const topPosts = await BlogPost.findAll({
      attributes: ['id', 'title', 'views_count', 'published_at'],
      where: { is_published: true },
      order: [['views_count', 'DESC']],
      limit: 10,
      raw: true,
    });

    // Lesson completion rate
    const totalProgress = await UserProgress.count();
    const completedProgress = await UserProgress.count({ where: { completed: true } });
    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

    res.json({
      usersPerMonth,
      topPosts,
      completionRate,
      totalLessonAttempts: totalProgress,
      completedLessons: completedProgress,
    });
  } catch (err) { next(err); }
});

module.exports = router;
