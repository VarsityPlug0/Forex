/**
 * Seed script — creates an admin user and initial data.
 * Run: node src/seeders/seed.js
 */
const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const {
  User, CourseCategory, Course, Lesson,
  BlogCategory, BlogPost,
  PammGroup, PammPerformance,
  CommunityChannel, ForumCategory, Announcement,
  SystemSetting,
} = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('Models synced.');

    // ── Admin user ──
    const existingAdmin = await User.findOne({ where: { email: 'admin@forexedge.com' } });
    if (!existingAdmin) {
      const hash = await bcrypt.hash('Admin123!', 12);
      await User.create({
        email: 'admin@forexedge.com',
        username: 'admin',
        full_name: 'Platform Admin',
        password_hash: hash,
        role: 'admin',
        is_active: true,
        email_verified: true,
      });
      console.log('Admin user created: admin@forexedge.com / Admin123!');
    } else {
      console.log('Admin user already exists.');
    }

    // ── Course categories ──
    const categories = [
      { name: 'Market Foundations', slug: 'market-foundations', description: 'Learn the basics of financial markets', icon: 'globe', sort_order: 1 },
      { name: 'Supply & Demand', slug: 'supply-demand', description: 'Master supply and demand zones', icon: 'scale', sort_order: 2 },
      { name: 'Order Flow & Liquidity', slug: 'order-flow', description: 'Understand market microstructure', icon: 'bar-chart-3', sort_order: 3 },
      { name: 'Market Structure', slug: 'market-structure', description: 'Analyze market structure', icon: 'layers', sort_order: 4 },
      { name: 'Risk Management', slug: 'risk-management', description: 'Learn proper position sizing', icon: 'shield', sort_order: 5 },
      { name: 'Trading Psychology', slug: 'trading-psychology', description: 'Develop the right mindset', icon: 'brain', sort_order: 6 },
      { name: 'Strategy Development', slug: 'strategy-development', description: 'Build trading strategies', icon: 'settings', sort_order: 7 },
    ];
    for (const cat of categories) {
      await CourseCategory.findOrCreate({ where: { slug: cat.slug }, defaults: cat });
    }
    console.log('Course categories seeded.');

    // ── Blog categories ──
    const blogCats = [
      { name: 'Market Analysis', slug: 'market-analysis', description: 'Weekly market breakdowns' },
      { name: 'Strategy', slug: 'strategy', description: 'Proven trading techniques' },
      { name: 'Psychology', slug: 'psychology', description: 'Trading mindset' },
      { name: 'Fundamentals', slug: 'fundamentals', description: 'Economic events and impact' },
      { name: 'PAMM Updates', slug: 'pamm-updates', description: 'Monthly performance reports' },
      { name: 'Education', slug: 'education', description: 'Learning resources' },
    ];
    for (const cat of blogCats) {
      await BlogCategory.findOrCreate({ where: { slug: cat.slug }, defaults: cat });
    }
    console.log('Blog categories seeded.');

    // ── PAMM groups ──
    const groups = [
      { name: 'Scalping Elite', slug: 'scalping-elite', description: 'High-frequency scalping strategy targeting 20-80 pip moves.', strategy_type: 'scalping', risk_level: 'medium', minimum_investment: 500 },
      { name: 'Swing Masters', slug: 'swing-masters', description: 'Patient swing trading on H4/Daily timeframes.', strategy_type: 'swing', risk_level: 'low', minimum_investment: 300 },
      { name: 'Hedge Shield', slug: 'hedge-shield', description: 'Ultra-conservative hedging approach for capital preservation.', strategy_type: 'hedge', risk_level: 'low', minimum_investment: 200 },
    ];
    for (const g of groups) {
      await PammGroup.findOrCreate({ where: { slug: g.slug }, defaults: g });
    }
    console.log('PAMM groups seeded.');

    // ── Community channels ──
    await CommunityChannel.findOrCreate({
      where: { slug: 'telegram-vip' },
      defaults: { name: 'Telegram VIP Group', slug: 'telegram-vip', description: 'Real-time trade alerts and live analysis.', channel_type: 'telegram', member_count: 2400, sort_order: 1 },
    });
    await CommunityChannel.findOrCreate({
      where: { slug: 'discord-server' },
      defaults: { name: 'Discord Server', slug: 'discord-server', description: 'Structured discussion and education.', channel_type: 'discord', member_count: 1800, sort_order: 2 },
    });
    console.log('Community channels seeded.');

    // ── System settings ──
    const settings = [
      { setting_key: 'site.name', setting_value: 'ForexEdge', setting_type: 'string', category: 'general', is_public: true },
      { setting_key: 'site.tagline', setting_value: 'Professional Forex Education & PAMM Investing', setting_type: 'string', category: 'general', is_public: true },
      { setting_key: 'seo.default_title', setting_value: 'ForexEdge – Professional Forex Education & PAMM Investing', setting_type: 'string', category: 'seo', is_public: true },
    ];
    for (const s of settings) {
      await SystemSetting.findOrCreate({ where: { setting_key: s.setting_key }, defaults: s });
    }
    console.log('System settings seeded.');

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
