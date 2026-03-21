const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BlogCategory = sequelize.define('BlogCategory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'blog_categories', timestamps: true, updatedAt: false });

const BlogPost = sequelize.define('BlogPost', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  author_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  category_id: { type: DataTypes.UUID, references: { model: 'blog_categories', key: 'id' } },
  title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(200), unique: true, allowNull: false },
  excerpt: DataTypes.TEXT,
  content: { type: DataTypes.TEXT, allowNull: false },
  featured_image: DataTypes.TEXT,
  meta_title: DataTypes.STRING(200),
  meta_description: DataTypes.TEXT,
  meta_keywords: DataTypes.TEXT,
  tags: DataTypes.TEXT, // JSON array
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  published_at: DataTypes.DATE,
  scheduled_at: DataTypes.DATE,
  views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  reading_time: DataTypes.INTEGER,
}, { tableName: 'blog_posts', timestamps: true });

module.exports = { BlogCategory, BlogPost };
