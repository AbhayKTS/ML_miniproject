const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET = process.env.JWT_SECRET || "chhaya-dev-secret";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const signToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, {
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
      req.user = null;
    }
  }
  next();
};

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  attachUser
};
