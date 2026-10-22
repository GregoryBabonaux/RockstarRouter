#!/bin/bash
# Prepares the packs used by the benchmark in bench/packs/ (git, node, npx and uvx required).
set -e
B="$(cd "$(dirname "$0")" && pwd)"; P=$B/packs; mkdir -p $P
[ -d $P/superpowers ] || git clone -q --depth 1 https://github.com/obra/superpowers.git $P/superpowers
[ -d $P/ecc ] || git clone -q --depth 1 https://github.com/affaan-m/ECC.git $P/ecc
[ -d $P/compound-engineering ] || git clone -q --depth 1 https://github.com/EveryInc/compound-engineering-plugin.git $P/compound-engineering
[ -d $HOME/agent-os ] || git clone -q --depth 1 https://github.com/buildermethods/agent-os.git $HOME/agent-os
commit() { (cd "$1" && git init -q && git add -A && git -c user.email=b@b -c user.name=bench commit -qm base); }
for v in plain bmad speckit openspec ccsdd agentos; do
  D=$P/demo-$v; [ -d $D ] && continue
  cp -r $B/demo-repo $D
  case $v in
    bmad) npx -y bmad-method@latest install --directory $D --modules bmm --tools claude-code --yes >/dev/null ;;
    speckit) (cd $D && uvx --from git+https://github.com/github/spec-kit.git specify init --here --force --non-interactive --integration claude --ignore-agent-tools >/dev/null) ;;
    openspec) (cd $D && npx -y @fission-ai/openspec@latest init --tools claude >/dev/null) ;;
    ccsdd) (cd $D && npx -y cc-sdd@latest --claude-skills --lang en --yes >/dev/null) ;;
    agentos) (cd $D && bash $HOME/agent-os/scripts/project-install.sh < /dev/null >/dev/null) ;;
  esac
  commit $D
done
echo "packs ready in $P"
