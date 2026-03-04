const test = require("node:test");
const assert = require("node:assert/strict");
const { paginate } = require("../src/utils/pagination");

const items = Array.from({ length: 55 }, (_, i) => ({ id: i + 1 }));

test("pagination: defaults to page 1 with 20 items", () => {
  const result = paginate({}, items);
  assert.equal(result.data.length, 20);
  assert.equal(result.meta.page, 1);
  assert.equal(result.meta.total, 55);
  assert.equal(result.meta.totalPages, 3);
  assert.equal(result.meta.hasNext, true);
  assert.equal(result.meta.hasPrev, false);
});

test("pagination: page 2 returns next slice", () => {
  const result = paginate({ page: "2" }, items);
  assert.equal(result.data.length, 20);
  assert.equal(result.data[0].id, 21);
  assert.equal(result.meta.hasNext, true);
  assert.equal(result.meta.hasPrev, true);
});

test("pagination: last page returns remaining items", () => {
  const result = paginate({ page: "3" }, items);
  assert.equal(result.data.length, 15);
  assert.equal(result.meta.hasNext, false);
  assert.equal(result.meta.hasPrev, true);
});

test("pagination: custom limit", () => {
  const result = paginate({ limit: "10" }, items);
  assert.equal(result.data.length, 10);
  assert.equal(result.meta.totalPages, 6);
});

test("pagination: limit capped at 100", () => {
  const result = paginate({ limit: "500" }, items);
  assert.equal(result.meta.limit, 100);
});

test("pagination: negative page defaults to 1", () => {
  const result = paginate({ page: "-5" }, items);
  assert.equal(result.meta.page, 1);
});

test("pagination: empty items returns empty data", () => {
  const result = paginate({}, []);
  assert.equal(result.data.length, 0);
  assert.equal(result.meta.total, 0);
  assert.equal(result.meta.totalPages, 0);
});
