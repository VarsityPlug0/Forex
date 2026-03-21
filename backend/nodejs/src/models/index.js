const User = require('./User');
const { CourseCategory, Course, Lesson, UserProgress } = require('./Course');
const { BlogCategory, BlogPost } = require('./Blog');
const { PammGroup, PammPerformance, Investment, DailyTrade } = require('./Pamm');
const { CommunityChannel, ForumCategory, ForumTopic, Announcement } = require('./Community');
const { SystemSetting, Notification } = require('./System');

// ── Associations ──

// User → Profile & Content
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'posts' });
User.hasMany(Investment, { foreignKey: 'user_id', as: 'investments' });
User.hasMany(UserProgress, { foreignKey: 'user_id', as: 'progress' });
User.hasMany(ForumTopic, { foreignKey: 'author_id', as: 'topics' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
User.hasMany(Announcement, { foreignKey: 'author_id', as: 'announcements' });

// Blog
BlogCategory.hasMany(BlogPost, { foreignKey: 'category_id', as: 'posts' });
BlogPost.belongsTo(BlogCategory, { foreignKey: 'category_id', as: 'category' });
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Courses
CourseCategory.hasMany(Course, { foreignKey: 'category_id', as: 'courses' });
Course.belongsTo(CourseCategory, { foreignKey: 'category_id', as: 'category' });
Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Course.hasMany(UserProgress, { foreignKey: 'course_id', as: 'progress' });
Lesson.hasMany(UserProgress, { foreignKey: 'lesson_id', as: 'progress' });
UserProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
UserProgress.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// PAMM
PammGroup.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });
PammGroup.hasMany(PammPerformance, { foreignKey: 'pamm_group_id', as: 'performance' });
PammGroup.hasMany(Investment, { foreignKey: 'pamm_group_id', as: 'investments' });
PammGroup.hasMany(DailyTrade, { foreignKey: 'pamm_group_id', as: 'trades' });
PammPerformance.belongsTo(PammGroup, { foreignKey: 'pamm_group_id', as: 'group' });
Investment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Investment.belongsTo(PammGroup, { foreignKey: 'pamm_group_id', as: 'group' });
DailyTrade.belongsTo(PammGroup, { foreignKey: 'pamm_group_id', as: 'group' });

// Community
ForumCategory.hasMany(ForumTopic, { foreignKey: 'category_id', as: 'topics' });
ForumTopic.belongsTo(ForumCategory, { foreignKey: 'category_id', as: 'category' });
ForumTopic.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Announcement.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

module.exports = {
  User,
  CourseCategory, Course, Lesson, UserProgress,
  BlogCategory, BlogPost,
  PammGroup, PammPerformance, Investment, DailyTrade,
  CommunityChannel, ForumCategory, ForumTopic, Announcement,
  SystemSetting, Notification,
};
