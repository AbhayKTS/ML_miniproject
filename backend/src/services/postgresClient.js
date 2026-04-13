let pgPackage = null;
try {
  pgPackage = require("pg");
} catch (_error) {
  pgPackage = null;
}

const getPool = () => {
  if (!pgPackage) {
    return null;
  }
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const { Pool } = pgPackage;
  return new Pool({ connectionString: process.env.DATABASE_URL });
};

module.exports = {
  getPool
};
