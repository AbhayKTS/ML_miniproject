const express = require("express");
const { signUp, login } = require("../services/authService");
const { catchAsync } = require("../middleware/catchAsync");

const router = express.Router();

router.post(
  "/signup",
  catchAsync(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const result = await signUp({ email, password, name });
    res.status(201).json({ user: result.user, token: result.token });
  })
);

router.post(
  "/login",
  catchAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const result = await login({ email, password });
    res.json({ user: result.user, token: result.token });
  })
);

module.exports = router;
