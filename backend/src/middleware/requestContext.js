const { v4: uuid } = require("uuid");

const requestContext = (req, res, next) => {
  req.requestId = req.headers["x-request-id"] || uuid();
  res.setHeader("x-request-id", req.requestId);
  next();
};

module.exports = { requestContext };
// requestContext middleware – injects correlationId into every request
const { v4: uuidv4 } = require('uuid');

const requestContext = (req, _res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  next();
};

module.exports = { requestContext };
