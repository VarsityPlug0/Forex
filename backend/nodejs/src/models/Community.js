const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CommunityChannel = sequelize.define('CommunityChannel', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  channel_type: DataTypes.ENUM('telegram', 'discord', 'internal'),
  invite_link: DataTypes.TEXT,
  member_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'community_channels', timestamps: true, updatedAt: false });

const ForumCategory = sequelize.define('ForumCategory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  icon: DataTypes.STRING(50),
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'forum_categories', timestamps: true, updatedAt: false });

const ForumTopic = sequelize.define('ForumTopic', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  category_id: { type: DataTypes.UUID, references: { model: 'forum_categories', key: 'id' } },
  author_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(200), unique: true, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
  views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  replies_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_reply_at: DataTypes.DATE,
}, { tableName: 'forum_topics', timestamps: true });

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  author_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  published_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'announcements', timestamps: true });

module.exports = { CommunityChannel, ForumCategory, ForumTopic, Announcement };
