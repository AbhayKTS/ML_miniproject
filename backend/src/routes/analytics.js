// Analytics routes
const router = require('express').Router();
const { requireAuth } = require('../middleware/requireAuth');
const { getStats } = require('../services/analyticsService');

router.get('/', requireAuth, (req, res) => {
  res.json(getStats(req.user.uid));
});

module.exports = router;
