const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const { BlogPost, BlogCategory, User } = require('../models');

const router = express.Router();

// GET /categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await BlogCategory.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
    res.json({ categories });
  } catch (err) { next(err); }
});

// GET / — public list
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    const offset = (page - 1) * limit;
    const where = { is_published: true };

    if (category) where.category_id = category;
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await BlogPost.findAndCountAll({
      where,
      include: [
        { model: BlogCategory, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: User, as: 'author', attributes: ['id', 'username', 'full_name', 'avatar_url'] },
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ posts: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
});

// GET /:slug — single post
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({
      where: { slug: req.params.slug, is_published: true },
      include: [
        { model: BlogCategory, as: 'category' },
        { model: User, as: 'author', attributes: ['id', 'username', 'full_name', 'avatar_url'] },
      ],
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.increment('views_count');
    res.json({ post });
  } catch (err) { next(err); }
});

// POST / — create (admin)
router.post(
  '/',
  requireAuth, requireAdmin,
  [
    body('title').notEmpty().trim(),
    body('content').notEmpty(),
    body('slug').notEmpty().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const post = await BlogPost.create({ ...req.body, author_id: req.user.id });
      res.status(201).json({ post });
    } catch (err) { next(err); }
  }
);

// PUT /:id — update (admin)
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Auto-set published_at if publishing for first time
    if (req.body.is_published && !post.is_published && !post.published_at) {
      req.body.published_at = new Date();
    }

    await post.update(req.body);
    res.json({ post });
  } catch (err) { next(err); }
});

// DELETE /:id — delete (admin)
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
});

// POST /categories — create category (admin)
router.post('/categories', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const category = await BlogCategory.create(req.body);
    res.status(201).json({ category });
  } catch (err) { next(err); }
});

module.exports = router;
