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
<<<<<<< HEAD

  const store = await getStore();
  if (store.users.find((user) => user.email === email)) {
    throw new Error("User already exists");
  }
  const user = {
    id: uuid(),
    email,
    name,
    role: "user",
    password: await hashPassword(password)
  };

  await updateStore((updated) => {
    updated.users.push(user);
    return updated;
  });

  return { user, token: signToken(user) };
=======
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
};

const login = async ({ email, password }) => {
  throw new Error("Use Firebase Client SDK for email/password login and pass the JWT token to the backend.");
};

<<<<<<< HEAD
const loginWithFirebase = async ({ email, name }) => {
  const store = await getStore();
  let user = store.users.find((entry) => entry.email === email);

  if (!user) {
    user = {
      id: uuid(),
      email,
      name: name || email.split("@")[0],
      role: "user",
      password: await hashPassword(uuid())
    };

    await updateStore((updated) => {
      updated.users.push(user);
      return updated;
    });
  }

  return { user, token: signToken(user) };
};

module.exports = {
  signUp,
  login,
  loginWithFirebase
};
=======
module.exports = { signUp, login };
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
