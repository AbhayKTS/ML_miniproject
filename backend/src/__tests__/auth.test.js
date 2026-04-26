// Unit tests for auth middleware
const { requireAuth } = require('../middleware/requireAuth');

describe('requireAuth', () => {
  it('should reject unauthenticated requests', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next for authenticated requests', () => {
    const req = { user: { uid: 'test123' } };
    const res = {};
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
