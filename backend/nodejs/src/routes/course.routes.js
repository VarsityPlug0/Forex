const express = require('express');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/auth');
const { CourseCategory, Course, Lesson, UserProgress } = require('../models');

const router = express.Router();

// GET /categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await CourseCategory.findAll({ where: { is_active: true }, order: [['sort_order', 'ASC']] });
    res.json({ categories });
  } catch (err) { next(err); }
});

// GET / — list published courses
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      where: { is_published: true },
      include: [
        { model: CourseCategory, as: 'category', attributes: ['id', 'name', 'slug', 'icon'] },
        { model: Lesson, as: 'lessons', attributes: ['id'], where: { is_published: true }, required: false },
      ],
      order: [['sort_order', 'ASC']],
    });

    // Attach progress if user is logged in
    if (req.user) {
      const progress = await UserProgress.findAll({ where: { user_id: req.user.id } });
      const progressMap = {};
      progress.forEach((p) => {
        if (!progressMap[p.course_id]) progressMap[p.course_id] = { total: 0, completed: 0 };
        progressMap[p.course_id].total++;
        if (p.completed) progressMap[p.course_id].completed++;
      });
      courses.forEach((c) => { c.dataValues.userProgress = progressMap[c.id] || null; });
    }

    res.json({ courses });
  } catch (err) { next(err); }
});

// GET /:slug — course detail with lessons
router.get('/:slug', optionalAuth, async (req, res, next) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug, is_published: true },
      include: [
        { model: CourseCategory, as: 'category' },
        { model: Lesson, as: 'lessons', where: { is_published: true }, required: false, order: [['sort_order', 'ASC']] },
      ],
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (req.user) {
      const progress = await UserProgress.findAll({
        where: { user_id: req.user.id, course_id: course.id },
      });
      course.dataValues.userProgress = progress;
    }

    res.json({ course });
  } catch (err) { next(err); }
});

// GET /:slug/:lessonSlug — single lesson
router.get('/:slug/:lessonSlug', optionalAuth, async (req, res, next) => {
  try {
    const course = await Course.findOne({ where: { slug: req.params.slug } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const lesson = await Lesson.findOne({
      where: { course_id: course.id, slug: req.params.lessonSlug, is_published: true },
    });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // Track progress
    if (req.user) {
      await UserProgress.upsert({
        user_id: req.user.id, lesson_id: lesson.id, course_id: course.id,
        last_accessed: new Date(),
      });
    }

    res.json({ lesson, course: { id: course.id, title: course.title, slug: course.slug } });
  } catch (err) { next(err); }
});

// POST /progress/:lessonId/complete — mark lesson complete
router.post('/progress/:lessonId/complete', requireAuth, async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const [progress] = await UserProgress.upsert({
      user_id: req.user.id, lesson_id: lesson.id, course_id: lesson.course_id,
      completed: true, progress_percentage: 100, completed_at: new Date(),
    });

    res.json({ progress });
  } catch (err) { next(err); }
});

// ── Admin CRUD ──

// POST / — create course
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ course });
  } catch (err) { next(err); }
});

// PUT /:id
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.update(req.body);
    res.json({ course });
  } catch (err) { next(err); }
});

// POST /:courseId/lessons — add lesson
router.post('/:courseId/lessons', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const lesson = await Lesson.create({ ...req.body, course_id: req.params.courseId });
    res.status(201).json({ lesson });
  } catch (err) { next(err); }
});

// PUT /lessons/:id
router.put('/lessons/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    await lesson.update(req.body);
    res.json({ lesson });
  } catch (err) { next(err); }
});

// DELETE /lessons/:id
router.delete('/lessons/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    await lesson.destroy();
    res.json({ message: 'Lesson deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
