/**
 * Wraps an async route handler to catch errors and forward them to Express error handler.
 * Eliminates try/catch boilerplate in every route.
 * @param {Function} fn - async (req, res, next) => ...
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { catchAsync };
