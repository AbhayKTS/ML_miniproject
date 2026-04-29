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
