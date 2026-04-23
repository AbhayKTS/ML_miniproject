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
// Projects routes – CRUD for user projects
const router = require('express').Router();
const { requireAuth } = require('../middleware/requireAuth');

const store = new Map();

router.get('/', requireAuth, (req, res) => {
  res.json([...(store.get(req.user.uid) || [])]);
});

router.post('/', requireAuth, (req, res) => {
  const projects = store.get(req.user.uid) || [];
  const project = { id: Date.now().toString(), ...req.body, createdAt: new Date() };
  projects.push(project);
  store.set(req.user.uid, projects);
  res.status(201).json(project);
});

module.exports = router;
