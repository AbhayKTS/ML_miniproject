const { getPool } = require("../../services/postgresClient");

const insertGeneration = async ({ id, userId, modality, prompt, output, metadata }) => {
  const pool = getPool();
  if (!pool) {
    return null;
  }

  const query = `
    INSERT INTO content_history (id, user_id, modality, prompt, output, metadata)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, modality, created_at
  `;
  const values = [id, userId, modality, prompt, output, JSON.stringify(metadata || {})];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const insertFeedback = async ({ id, userId, generationId, rating, edits, signals }) => {
  const pool = getPool();
  if (!pool) {
    return null;
  }

  const query = `
    INSERT INTO feedback (id, user_id, generation_id, rating, edits, signals)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id, generation_id, created_at
  `;
  const values = [id, userId, generationId, rating, edits, JSON.stringify(signals || {})];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

module.exports = {
  insertGeneration,
  insertFeedback
};
