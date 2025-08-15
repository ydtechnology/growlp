#!/usr/bin/env bash
set -euo pipefail

# 他所で onKeyDown を増やしてないか
viol1=$(grep -Rn "onKeyDown" app components | grep -v "app/(console)/page.tsx" || true)
# 生の keydown リスナ（自前コードのみ）
viol2=$(grep -Rn "addEventListener(\"keydown\"" app components || true)
# 暗黙 submit
viol3=$(grep -Rn "<form" app components || true)

if [[ -n "$viol1$viol2$viol3" ]]; then
  echo "NG: Enter/keydown の増設や <form> が検出されました。"
  echo "$viol1"
  echo "$viol2"
  echo "$viol3"
  exit 1
fi
echo "OK: Enter/IME 周りは単一点管理のままです。"