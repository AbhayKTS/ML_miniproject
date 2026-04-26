// Tests for centralized error handler
const { errorHandler } = require('../middleware/errorHandler');

describe('errorHandler', () => {
  it('should respond with error status and message', () => {
    const err = { status: 422, message: 'Validation failed' };
    const req = { correlationId: 'abc' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorHandler(err, req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'Validation failed' });
  });
});
