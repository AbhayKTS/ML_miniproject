const admin = require('../utils/firebaseAdmin');

const signUp = async ({ name, email, password }) => {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    return { user: { id: userRecord.uid, email: userRecord.email, name: userRecord.displayName }, token: "USE_CLIENT_SDK_FOR_TOKEN" };
  } catch (err) {
    throw new Error(err.message);
  }
};

const login = async ({ email, password }) => {
  throw new Error("Use Firebase Client SDK for email/password login and pass the JWT token to the backend.");
};

module.exports = { signUp, login };
