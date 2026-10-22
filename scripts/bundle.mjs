// prepack: copy skills/, AGENTS.snippet.md, README.md and LICENSE into cli/ so the npm package carries them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'cli');
fs.rmSync(path.join(cli, 'skills'), { recursive: true, force: true });
fs.cpSync(path.join(root, 'skills'), path.join(cli, 'skills'), { recursive: true });
for (const f of ['AGENTS.snippet.md', 'README.md', 'LICENSE']) fs.copyFileSync(path.join(root, f), path.join(cli, f));
console.log('bundled skills/, AGENTS.snippet.md, README.md and LICENSE into cli/');
