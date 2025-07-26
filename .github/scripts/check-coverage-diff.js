import fs from "node:fs";

const current = JSON.parse(fs.readFileSync("current-coverage.json", "utf8"));
const base = JSON.parse(fs.readFileSync("base-coverage.json", "utf8"));

const categories = ["statements", "branches", "functions", "lines"];
let failed = false;

console.log("📊 Coverage Regression Check:\n");

for (const cat of categories) {
  const currentPct = current.total[cat].pct;
  const basePct = base.total[cat].pct;

  const diff = currentPct - basePct;
  const emoji = diff < 0 ? "❌" : diff === 0 ? "=" : "✅";
  const message = `${emoji} ${cat}: ${currentPct}% (base: ${basePct}%)`;

  console.log(message);

  if (diff < 0) {
    failed = true;
  }
}

if (failed) {
  console.error("\n❌ Coverage regression detected.");
  throw new Error(
    "Coverage regression detected. Please add tests for the code affected in this pull request.",
  );
} else {
  console.log("\n✅ No coverage regression.");
}
