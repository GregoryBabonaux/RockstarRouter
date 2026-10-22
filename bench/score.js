// usage: node score.js <results.json>
// Scores each config on the goal: no heavy pipeline when a lighter path works,
// and the heavy process (or a stop to ask) when it is warranted.
const r = require(require("path").resolve(process.argv[2]));
const LIGHT = new Set(["rockstar-router", "deep", "quick", "systematic-debugging", "test-driven-development", "verification-before-completion"]);
const heavy = x => x.skills.filter(s => !LIGHT.has(s));
const NOT_NEEDED = [1, 2, 3, 4, 5, 6, 7, 8, 12, 13]; // a light path is enough (or two questions)
const WARRANTED = [9, 10, 11, 14];                    // heavy process, or a stop to ask, is expected
const stopped = x => x.files === 0;
const k = n => (n / 1000).toFixed(0) + "k";
console.log("cfg      | heavy when not needed            | heavy (or stop) when warranted | tokens total");
for (const c of [...new Set(r.map(x => x.cfg))].sort()) {
  const rows = r.filter(x => x.cfg === c), by = id => rows.find(x => x.id === id);
  if (NOT_NEEDED.concat(WARRANTED).some(id => !by(id))) { console.log(c.padEnd(8), "| incomplete"); continue; }
  const useless = NOT_NEEDED.map(by).filter(x => heavy(x).length);
  const ok = WARRANTED.map(by).filter(x => heavy(x).length || stopped(x)).length;
  const tot = rows.reduce((a, x) => a + x.processed, 0);
  console.log(`${c.padEnd(8)} | ${(useless.length + " " + useless.map(x => x.id + ":" + heavy(x).join("+")).join(" ")).padEnd(32)} | ${ok}/4${" ".repeat(27)} | ${k(tot)}`);
}
