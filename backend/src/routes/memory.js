const express = require("express");
const { getMemory, updateMemory } = require("../services/creativeMemory");
const { memoryUpdateSchema, validate } = require("../utils/validators");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.user?.id || req.query.userId || "guest";
  const memory = await getMemory(userId);
  res.json(memory);
});

router.post("/update", async (req, res) => {
  const validation = validate(memoryUpdateSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }
  const userId = req.user?.id || validation.data.userId || "guest";
  console.log(`Updating memory for user: ${userId}`);
  await updateMemory(userId, validation.data.updates);
  const updated = await getMemory(userId);
  res.json(updated);
});

module.exports = router;
