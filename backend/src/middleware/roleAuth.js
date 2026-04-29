const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role || "user";
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

module.exports = { authorizeRoles };
