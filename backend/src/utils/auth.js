const admin = require("./firebaseAdmin");

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access. Token missing." });
  }

  const token = header.replace("Bearer ", "");
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
      role: decodedToken.role || 'user'
    };
    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    return res.status(401).json({ error: "Unauthorized access. Invalid token." });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
  }
  next();
};

module.exports = {
  requireAuth,
  requireRole
};
