const express = require("express");
const { getMemory, updateMemory } = require("../services/creativeMemory");
const { memoryUpdateSchema, validate } = require("../utils/validators");
const { requireAuth } = require("../utils/auth");

const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
<<<<<<< HEAD
  const userId = req.user.id;
=======
  const userId = req.user?.id || req.query.userId || "guest";
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
  const memory = await getMemory(userId);
  res.json(memory);
});

router.post("/update", requireAuth, async (req, res) => {
  const validation = validate(memoryUpdateSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }
  const userId = req.user.id;
  console.log(`Updating memory for user: ${userId}`);
  await updateMemory(userId, validation.data.updates);
  const updated = await getMemory(userId);
  res.json(updated);
});

module.exports = router;
// Memory routes – store and retrieve creative context
const router = require('express').Router();
const { requireAuth } = require('../middleware/requireAuth');
const { getMemory, setMemory, clearMemory } = require('../services/creativeMemory');

router.get('/', requireAuth, async (req, res, next) => {
  try { res.json(await getMemory(req.user.uid)); } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try { res.json(await setMemory(req.user.uid, req.body)); } catch (e) { next(e); }
});

router.delete('/', requireAuth, async (req, res, next) => {
  try { await clearMemory(req.user.uid); res.json({ ok: true }); } catch (e) { next(e); }
});

module.exports = router;
