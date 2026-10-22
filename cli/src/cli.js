import { readFileSync } from 'node:fs';
import { runSkills } from './skills.js';
import { runInit } from './init.js';
import { runDoctor } from './doctor.js';
import { runUpdate } from './update.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
export const VERSION = pkg.version;

export function parseOptions(args) {
  const o = { yes: false, dryRun: false, quiet: false, target: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--yes' || a === '-y') o.yes = true;
    else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--quiet') o.quiet = true;
    else if (a === '--target') o.target = args[++i] ?? null;
  }
  return o;
}

const HELP = `rockstar-router ${VERSION}: stops your agent from booking a stadium tour to change a button color

Usage: rockstar-router <command> [options]

  skills   install the skill into ~/.agents/skills and ~/.claude/skills [--target <dir>] [--yes]
  init     add the routing rule to AGENTS.md (and CLAUDE.md / GEMINI.md if the project uses them) [--yes]
  doctor   check the installation [--quiet]
  update   refresh skill copies and routing rules installed by this CLI

Nothing is written without --yes: without it, commands show what they would change.
`;

export async function run(argv, io) {
  const [cmd, ...rest] = argv;
  const opts = parseOptions(rest);
  if (cmd === '--version' || cmd === '-v') { io.stdout.write(`${VERSION}\n`); return 0; }
  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') { io.stdout.write(HELP); return 0; }
  try {
    if (cmd === 'skills') return runSkills(io, opts, VERSION);
    if (cmd === 'init') return runInit(io, opts, VERSION);
    if (cmd === 'doctor') return runDoctor(io, opts, VERSION);
    if (cmd === 'update') return runUpdate(io, opts, VERSION);
  } catch (err) {
    io.stderr.write(`rockstar-router: ${err.message}\n`);
    return 1;
  }
  io.stderr.write(`rockstar-router: unknown command "${cmd}". Commands: skills, init, doctor, update\n`);
  return 1;
}
