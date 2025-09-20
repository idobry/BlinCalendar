#!/bin/bash

# Git Workflow Helper for Trading Journal Project
# Usage: ./git-workflow.sh [command]

case "$1" in
  "status"|"s")
    echo "=== Git Status ==="
    git status
    ;;
  "commit"|"c")
    echo "=== Adding all changes ==="
    git add .
    echo "Enter commit message:"
    read commit_message
    git commit -m "$commit_message"
    ;;
  "quick"|"q")
    shift
    echo "=== Quick commit with message: $* ==="
    git add .
    git commit -m "$*"
    ;;
  "log"|"l")
    echo "=== Recent commits ==="
    git log --oneline -10
    ;;
  "diff"|"d")
    echo "=== Current changes ==="
    git diff
    ;;
  "staged")
    echo "=== Staged changes ==="
    git diff --cached
    ;;
  "push")
    echo "=== Pushing to remote ==="
    git push
    ;;
  *)
    echo "Trading Journal Git Workflow Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status, s     - Show git status"
    echo "  commit, c     - Add all and commit (interactive)"
    echo "  quick, q      - Quick commit with message"
    echo "  log, l        - Show recent commits"
    echo "  diff, d       - Show current changes"
    echo "  staged        - Show staged changes"
    echo "  push          - Push to remote"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 quick 'Fix calendar popup styling'"
    echo "  $0 commit"
    ;;
esac