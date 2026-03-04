/**
 * Authentication guard middleware.
 * Requires a valid JWT token attached by the `attachUser` middleware.
 */
const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

module.exports = { requireAuth };
