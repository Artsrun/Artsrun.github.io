#!/usr/bin/env bash
# upsert-issue.sh "<title>" <body-file> — one open issue per title, body replaced each run.
set -euo pipefail
title="$1"; body="$2"
gh label create audit --color C4A35A --description "weekly automated audit" --force >/dev/null
n=$(gh issue list --state open --label audit --search "in:title \"$title\"" --json number,title \
  --jq "map(select(.title == \"$title\")) | .[0].number // empty")
if [ -n "$n" ]; then
  gh issue edit "$n" --body-file "$body"
  echo "updated #$n"
else
  gh issue create --title "$title" --label audit --body-file "$body"
fi
