// index.js — Local dev server only
const app = require("./app");

const PORT = process.env.PORT || 4000;
try {
  const { execSync } = require("child_process");
  execSync(`lsof -ti:${PORT} | xargs kill -9`, { stdio: "ignore" });
  console.log(`Successfully cleared port ${PORT}.`);
} catch (_) {}

app.listen(PORT, () => console.log(`Chhaya backend running on port ${PORT}`));
