const test = require("node:test");
const assert = require("node:assert/strict");
const { requireAuth } = require("../src/middleware/requireAuth");
const { catchAsync } = require("../src/middleware/catchAsync");

test("requireAuth: blocks request without user", () => {
  const req = { user: null };
  let statusCode, body;
  const res = {
    status(code) { statusCode = code; return this; },
    json(data) { body = data; }
  };
  const next = () => { throw new Error("next should not be called"); };

  requireAuth(req, res, next);
  assert.equal(statusCode, 401);
  assert.equal(body.error, "Authentication required");
});

test("requireAuth: allows request with valid user", () => {
  const req = { user: { id: "u1", email: "a@b.com" } };
  let called = false;
  const next = () => { called = true; };

  requireAuth(req, {}, next);
  assert.equal(called, true);
});

test("catchAsync: forwards thrown errors to next", async () => {
  const err = new Error("boom");
  const handler = catchAsync(async () => { throw err; });

  let captured;
  await handler({}, {}, (e) => { captured = e; });
  assert.equal(captured, err);
});

test("catchAsync: works with normal async handlers", async () => {
  let sent;
  const handler = catchAsync(async (_req, res) => {
    res.json({ ok: true });
  });

  await handler({}, { json: (data) => { sent = data; } }, () => {});
  assert.deepEqual(sent, { ok: true });
});
