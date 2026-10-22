# Releasing

One version for the whole project (skill, plugin, CLI).

1. `node scripts/versions.mjs <x.y.z>`: bumps cli/package.json, plugin.json, marketplace.json and the SKILL.md metadata.
2. `npm test && npm run versions`.
3. Commit, tag `v<x.y.z>`.
4. `cd cli && npm publish` (prepack bundles the skill, AGENTS.snippet.md, README and LICENSE).
5. `npm view rockstar-router-cli@<x.y.z> version` must answer before going on.
6. Push the commit and the tag. The Claude Code marketplace and skills.sh read the repository.
