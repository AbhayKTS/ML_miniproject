const admin = require('./firebaseAdmin');

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized — no token provided' });

<<<<<<< HEAD
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const signToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role || "user" }, SECRET, {
    expiresIn: "7d"
  });
};

const attachUser = (req, _res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      const token = header.replace("Bearer ", "");
      req.user = jwt.verify(token, SECRET);
    } catch (error) {
      const token = header.replace("Bearer ", "");
      const decoded = jwt.decode(token);
      const issuer = decoded?.iss || "";
      if (decoded?.email && (issuer.includes("securetoken.google.com") || issuer.includes("accounts.google.com"))) {
        req.user = {
          id: decoded.sub || decoded.user_id || decoded.email,
          email: decoded.email,
          name: decoded.name || decoded.email,
          role: decoded.role || "user"
        };
      } else {
        req.user = null;
      }
    }
=======
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: 'Invalid token', details: error.message });
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
  }
};

<<<<<<< HEAD
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  attachUser,
  requireAuth
};
=======
module.exports = { requireAuth };
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
