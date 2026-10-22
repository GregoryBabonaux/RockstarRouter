import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// In the repository (cli/ next to skills/), the live files win over a stale bundled copy.
// In the npm package, prepack has bundled skills/ and AGENTS.snippet.md into cli/.
const inRepo = () => fs.existsSync(fileURLToPath(new URL('../../.claude-plugin/plugin.json', import.meta.url)));

function pick(repoRel, bundledRel) {
  const repo = fileURLToPath(new URL(repoRel, import.meta.url));
  const bundled = fileURLToPath(new URL(bundledRel, import.meta.url));
  const candidates = inRepo() ? [repo, bundled] : [bundled, repo];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

export const skillsSource = () => pick('../../skills', '../skills');
export const snippetSource = () => pick('../../AGENTS.snippet.md', '../AGENTS.snippet.md');
