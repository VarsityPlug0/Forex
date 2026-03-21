const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SystemSetting = sequelize.define('SystemSetting', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  setting_key: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  setting_value: DataTypes.TEXT,
  setting_type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
  category: DataTypes.STRING(50),
  description: DataTypes.TEXT,
  is_public: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'system_settings', timestamps: true });

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  title: { type: DataTypes.STRING(200), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  notification_type: DataTypes.ENUM('info', 'success', 'warning', 'error', 'trade', 'investment'),
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  link: DataTypes.TEXT,
}, { tableName: 'notifications', timestamps: true, updatedAt: false });

module.exports = { SystemSetting, Notification };
