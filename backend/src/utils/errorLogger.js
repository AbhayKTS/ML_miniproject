// feat: initial scaffolding for advanced error reporting
// Dedicated error logger with stack trace capture
const { logger } = require('./logger');

function logError(context, err) {
  logger.error({
    context,
    message: err.message,
    stack: err.stack,
    code: err.code,
    status: err.status,
  }, 'application_error');
}

module.exports = { logError };
