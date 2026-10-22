#!/bin/bash
# usage: run.sh <cfg> <id>
#   cfg: sp | bmad | spk | ecc | osp | ccsdd | ce | aos   (pack alone)
#        same name + "rr" (pack + RockstarRouter), e.g. sprr, ccsddrr
# Run ./setup.sh once before.
B="$(cd "$(dirname "$0")" && pwd)"; P=$B/packs; RR="$(cd "$B/.." && pwd)"
cfg=$1; id=$2; pack=${cfg%rr}
req=$(awk -F'\t' -v i="$id" '$1==i{print $2}' $B/requests.tsv)
case $pack in
  sp)   SRC=$P/demo-plain;   PL="--plugin-dir $P/superpowers" ;;
  bmad) SRC=$P/demo-bmad;    PL="" ;;
  spk)  SRC=$P/demo-speckit; PL="" ;;
  ecc)  SRC=$P/demo-plain;   PL="--plugin-dir $P/ecc" ;;
  osp)  SRC=$P/demo-openspec; PL="" ;;
  ccsdd) SRC=$P/demo-ccsdd;  PL="" ;;
  aos)  SRC=$P/demo-agentos; PL="" ;;
  ce)   SRC=$P/demo-plain;   PL="--plugin-dir $P/compound-engineering" ;;
  *) echo "unknown cfg $cfg"; exit 1 ;;
esac
[[ "$cfg" == *rr ]] && PL="$PL --plugin-dir $RR"
mkdir -p $B/runs; W=$B/runs/$cfg-$id; rm -rf $W; cp -r $SRC $W; cd $W
timeout 900 claude -p "$req" $PL --model sonnet --output-format stream-json --verbose \
  --dangerously-skip-permissions --max-turns 30 --setting-sources project < /dev/null \
  > $B/runs/$cfg-$id.jsonl 2> $B/runs/$cfg-$id.err
{ git -c core.pager=cat diff --stat; git status --porcelain; } > $B/runs/$cfg-$id.diff 2>&1
echo "done $cfg-$id"
