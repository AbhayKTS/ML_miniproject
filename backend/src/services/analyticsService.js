// refactor: optimize database queries for analytics dashboard
// Lightweight analytics aggregator
const { logger } = require('../utils/logger');

const counters = new Map();

function track(event, uid) {
  const key = `${uid}:${event}`;
  counters.set(key, (counters.get(key) || 0) + 1);
  logger.info('event_tracked', { event, uid });
}

function getStats(uid) {
  const result = {};
  for (const [key, count] of counters) {
    if (key.startsWith(uid + ':')) result[key.slice(uid.length + 1)] = count;
  }
  return result;
}

module.exports = { track, getStats };
