// usage: node parse2.js <runs-dir> [<runs-dir> ...]  -> results2.json + table on stdout
// Tokens: "processed" = input + cache creation + cache read + output (everything the model handled),
// "generated" = output tokens only.
const fs = require("fs"), path = require("path");
const rows = [];
for (const dir of process.argv.slice(2)) {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".jsonl"))) {
    const base = f.replace(".jsonl", ""), cut = base.lastIndexOf("-");
    const cfg = base.slice(0, cut), id = +base.slice(cut + 1);
    const lines = fs.readFileSync(path.join(dir, f), "utf8").split("\n").filter(Boolean)
      .map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    const skills = []; let res = null, verdict = null;
    for (const m of lines) {
      if (m.type === "assistant") for (const c of m.message.content || []) {
        if (c.type === "tool_use" && c.name === "Skill" && c.input && c.input.skill) {
          const s = c.input.skill.replace(/^[a-z-]+:/, "");
          if (!skills.includes(s)) skills.push(s);
        }
        if (c.type === "text" && !verdict && /LANE:/.test(c.text)) verdict = c.text.match(/LANE:\s*(\w+)/)[1];
      }
      if (m.type === "result") res = m;
    }
    const u = res ? res.usage : null;
    const diffPath = path.join(dir, `${base}.diff`);
    const diff = fs.existsSync(diffPath) ? fs.readFileSync(diffPath, "utf8") : "";
    const changed = [...new Set((diff.match(/^ ?[MADR?]{1,2} (.+)$/gm) || []).map(l => l.trim().split(/\s+/).pop()))];
    rows.push({
      id, cfg, skills,
      processed: u ? u.input_tokens + u.cache_creation_input_tokens + u.cache_read_input_tokens + u.output_tokens : null,
      generated: u ? u.output_tokens : null,
      turns: res ? res.num_turns : null,
      files: changed.length, changed,
      verdict, result: res ? (res.result || "").slice(0, 600) : "NO_RESULT",
    });
  }
}
rows.sort((a, b) => a.id - b.id || a.cfg.localeCompare(b.cfg));
fs.writeFileSync(path.join(__dirname, "results.json"), JSON.stringify(rows, null, 1));
const k = n => (n == null ? "-" : (n / 1000).toFixed(0) + "k");
for (const r of rows) console.log(`${r.id}\t${r.cfg.padEnd(7)}\t${k(r.processed)}\tgen ${k(r.generated)}\t${r.turns}t\tf${r.files}\t${r.verdict || ""}\t[${r.skills.join(",")}]`);
