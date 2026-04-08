const csrfGuard = (req, res, next) => {
  if (process.env.ENABLE_CSRF !== "true") {
    return next();
  }

  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return next();
  }

  const token = req.headers["x-csrf-token"];
  if (!token || token !== process.env.CSRF_TOKEN) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  return next();
};

module.exports = { csrfGuard };
// CSRF guard – validates custom header for state-changing requests
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const csrfGuard = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'CSRF check failed' });
  }
  next();
};

module.exports = { csrfGuard };
