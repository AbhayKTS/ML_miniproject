const { updateStore, getStore } = require("../data/store");
const { hashPassword, verifyPassword, signToken } = require("../utils/auth");
const { v4: uuid } = require("uuid");

const signUp = async ({ email, password, name }) => {
  const store = await getStore();
  if (store.users.find((user) => user.email === email)) {
    throw new Error("User already exists");
  }
  const user = {
    id: uuid(),
    email,
    name,
    password: await hashPassword(password)
  };

  await updateStore((updated) => {
    updated.users.push(user);
    return updated;
  });

  return { user, token: signToken(user) };
};

const login = async ({ email, password }) => {
  const store = await getStore();
  const user = store.users.find((entry) => entry.email === email);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new Error("Invalid credentials");
  }
  return { user, token: signToken(user) };
};

module.exports = {
  signUp,
  login
};
