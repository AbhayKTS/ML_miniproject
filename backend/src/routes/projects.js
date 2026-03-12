const express = require("express");
const { listProjects, createProject } = require("../services/projectService");
const { projectSchema, validate } = require("../utils/validators");

const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const projects = await listProjects(userId);
  res.json(projects);
});

router.post("/", requireAuth, async (req, res) => {
  const validation = validate(projectSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }
  const userId = req.user.id;
  const project = await createProject({
    userId,
    name: validation.data.name,
    description: validation.data.description
  });
  res.status(201).json(project);
});

module.exports = router;
