const express = require("express");
const { signUp, login, loginWithFirebase } = require("../services/authService");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await signUp({ email, password, name });
    res.status(201).json({ user: result.user, token: result.token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await signUp({ email, password, name });
    res.status(201).json({ user: result.user, token: result.token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.json({ user: result.user, token: result.token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/firebase", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const result = await loginWithFirebase({ email, name });
    res.json({ user: result.user, token: result.token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
// Auth routes – register / login / refresh
const router = require('express').Router();

router.post('/register', async (req, res) => {
  // placeholder – handled client-side via Firebase SDK
  res.json({ message: 'Use Firebase client SDK for registration' });
});

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ uid: req.user.uid, email: req.user.email });
});

module.exports = router;
