#!/bin/bash
# Push Drape.ai to GitHub
# Run: chmod +x push-to-github.sh && ./push-to-github.sh

set -e
cd "$(dirname "$0")"

REMOTE="https://github.com/mn5658734/Drape.ai.git"

echo "=== Drape.ai - Push to GitHub ==="

# Init if needed
if [ ! -d .git ]; then
  git init
fi

# Add remote (ignore if exists)
git remote add origin "$REMOTE" 2>/dev/null || git remote set-url origin "$REMOTE"

# Stage all
git add .

# Commit (skip if nothing to commit)
if git diff --cached --quiet 2>/dev/null; then
  echo "Nothing to commit."
else
  git commit -m "Initial commit: Drape.ai - AI-powered digital wardrobe"
fi

# Push (use main branch - GitHub default)
git branch -M main 2>/dev/null || true
git push -u origin main

echo "Done! View at https://github.com/mn5658734/Drape.ai"
