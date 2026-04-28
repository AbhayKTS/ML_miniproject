// feat: robust input validation for multi-language inputs
// Input validation helpers
function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function validatePrompt(prompt) {
  if (!isNonEmptyString(prompt)) throw Object.assign(new Error('Prompt must be a non-empty string'), { status: 400 });
  if (prompt.length > 4000) throw Object.assign(new Error('Prompt exceeds 4000 character limit'), { status: 400 });
  return prompt.trim();
}

module.exports = { isNonEmptyString, validatePrompt };
