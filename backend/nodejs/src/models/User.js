const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  full_name: DataTypes.STRING(100),
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  avatar_url: DataTypes.TEXT,
  bio: DataTypes.TEXT,
  role: {
    type: DataTypes.ENUM('user', 'premium', 'admin', 'moderator'),
    defaultValue: 'user',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verification_token: DataTypes.STRING(100),
  reset_token: DataTypes.STRING(100),
  reset_token_expires: DataTypes.DATE,
  last_login: DataTypes.DATE,
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
