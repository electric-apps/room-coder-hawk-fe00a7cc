#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/fe00a7cc-f411-410f-a92b-5980067d9e2b/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 5b05e448b5ad53ec1ab5c860cea36ec6152014dbcfe33d3f74fdc6447248297d" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0