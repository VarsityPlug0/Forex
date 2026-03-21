const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PammGroup = sequelize.define('PammGroup', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  slug: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: DataTypes.TEXT,
  strategy_type: DataTypes.ENUM('scalping', 'swing', 'hedge', 'long_term'),
  risk_level: DataTypes.ENUM('low', 'medium', 'high', 'aggressive'),
  manager_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  total_capital: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  minimum_investment: { type: DataTypes.DECIMAL(10, 2), defaultValue: 100 },
  maximum_investors: { type: DataTypes.INTEGER, defaultValue: 100 },
  performance_fee_percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 20 },
  management_fee_percentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 2 },
  is_open: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'pamm_groups', timestamps: true });

const PammPerformance = sequelize.define('PammPerformance', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  pamm_group_id: { type: DataTypes.UUID, references: { model: 'pamm_groups', key: 'id' } },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  total_value: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  daily_return: DataTypes.DECIMAL(10, 4),
  monthly_return: DataTypes.DECIMAL(10, 4),
  yearly_return: DataTypes.DECIMAL(10, 4),
  max_drawdown: DataTypes.DECIMAL(10, 4),
}, { tableName: 'pamm_performance', timestamps: true, updatedAt: false });

const Investment = sequelize.define('Investment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  pamm_group_id: { type: DataTypes.UUID, references: { model: 'pamm_groups', key: 'id' } },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'active', 'withdrawn', 'closed'), defaultValue: 'pending' },
  invested_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  withdrawn_at: DataTypes.DATE,
  current_value: DataTypes.DECIMAL(15, 2),
  total_profit: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
}, { tableName: 'investments', timestamps: true });

const DailyTrade = sequelize.define('DailyTrade', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  pamm_group_id: { type: DataTypes.UUID, references: { model: 'pamm_groups', key: 'id' } },
  symbol: { type: DataTypes.STRING(20), allowNull: false },
  trade_type: DataTypes.ENUM('buy', 'sell'),
  entry_price: { type: DataTypes.DECIMAL(15, 6), allowNull: false },
  exit_price: DataTypes.DECIMAL(15, 6),
  quantity: { type: DataTypes.DECIMAL(15, 6), allowNull: false },
  profit_loss: DataTypes.DECIMAL(15, 2),
  profit_loss_percentage: DataTypes.DECIMAL(10, 4),
  opened_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  closed_at: DataTypes.DATE,
  status: { type: DataTypes.ENUM('open', 'closed', 'cancelled'), defaultValue: 'open' },
  notes: DataTypes.TEXT,
}, { tableName: 'daily_trades', timestamps: true, updatedAt: false });

module.exports = { PammGroup, PammPerformance, Investment, DailyTrade };
