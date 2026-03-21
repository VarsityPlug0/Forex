const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CourseCategory = sequelize.define('CourseCategory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  icon: DataTypes.STRING(50),
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'course_categories', timestamps: true, updatedAt: false });

const Course = sequelize.define('Course', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  category_id: { type: DataTypes.UUID, references: { model: 'course_categories', key: 'id' } },
  title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(200), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  thumbnail_url: DataTypes.TEXT,
  difficulty: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
  estimated_hours: { type: DataTypes.INTEGER, defaultValue: 1 },
  is_free: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'courses', timestamps: true });

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  course_id: { type: DataTypes.UUID, references: { model: 'courses', key: 'id' } },
  title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(200), allowNull: false },
  content: DataTypes.TEXT,
  video_url: DataTypes.TEXT,
  video_duration: DataTypes.INTEGER,
  thumbnail_url: DataTypes.TEXT,
  resources_json: DataTypes.TEXT, // JSON array of downloadable resources
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'lessons', timestamps: true });

const UserProgress = sequelize.define('UserProgress', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  lesson_id: { type: DataTypes.UUID, references: { model: 'lessons', key: 'id' } },
  course_id: { type: DataTypes.UUID, references: { model: 'courses', key: 'id' } },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  progress_percentage: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_accessed: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completed_at: DataTypes.DATE,
}, { tableName: 'user_progress', timestamps: true, updatedAt: false });

module.exports = { CourseCategory, Course, Lesson, UserProgress };
