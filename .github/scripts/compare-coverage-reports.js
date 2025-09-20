import fs from "node:fs";

const current = JSON.parse(fs.readFileSync("current-coverage.json", "utf8"));
const base = JSON.parse(fs.readFileSync("base-coverage.json", "utf8"));

// skip branches because untested files default to 100% branch coverage
const categories = ["statements", "functions", "lines"];
let failed = false;

const messages = ["📊 Coverage Regression Check:"];

const MAX_COVERAGE_REGRESSION = 0;

for (const category of categories) {
  const currentCoverage = current.total[category].pct;
  const baseCoverage = base.total[category].pct;

  const diff = baseCoverage - currentCoverage;
  const failedNow = diff > MAX_COVERAGE_REGRESSION;
  const emoji = failedNow ? "❌" : diff === 0 ? "=" : "✅";
  messages.push(
    `${emoji} ${category}: ${currentCoverage}% (base: ${baseCoverage}%)`,
  );
  failed ||= failedNow;
}

console.log(messages.join("\n"));

if (failed) {
  console.error("\n❌ Coverage regression detected.");
  throw new Error(
    "Coverage regression detected. Please add tests for the code affected in this pull request.",
  );
} else {
  console.log("\n✅ No coverage regression.");
}
