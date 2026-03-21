const { validationResult } = require('express-validator');

/**
 * Middleware that checks express-validator results and returns 400 if invalid.
 * Use after validator chain: router.post('/foo', [...validators], validate, handler)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
