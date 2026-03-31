#!/bin/bash
set -e
echo "=== Node: $(node -v), npm: $(npm -v) ==="
echo "=== Installing dependencies ==="
npm install --no-audit --no-fund 2>&1
echo "=== Install done, starting build ==="
export NODE_OPTIONS="--max-old-space-size=460"
export NEXT_TELEMETRY_DISABLED=1
npx next build 2>&1
echo "=== Build complete ==="
