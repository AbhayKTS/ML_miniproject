const express = require("express");
const { listProjects, createProject } = require("../services/projectService");
const { projectSchema, validate } = require("../utils/validators");
const { requireAuth } = require("../utils/auth");

const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
<<<<<<< HEAD
  const userId = req.user.id;
=======
  const userId = req.user?.id || req.query.userId || "guest";
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
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
