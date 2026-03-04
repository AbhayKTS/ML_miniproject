/**
 * Parse pagination query params and apply to an array of items.
 * @param {Object} query - Express req.query
 * @param {Array} items - Full array of records
 * @returns {{ data: Array, meta: Object }} Paginated result with metadata
 */
const paginate = (query, items) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

module.exports = { paginate };
