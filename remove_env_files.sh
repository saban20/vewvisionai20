#!/bin/bash

# This script uses git filter-branch to remove .env files from Git history

echo "Cleaning sensitive files from Git repository..."

# Create a backup of the repository
echo "Creating backup of the repository..."
cp -r .git .git.bak

# Use git filter-branch to remove .env files
echo "Removing .env files from Git history..."
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env NewVisionAI/backend/.env' \
  --prune-empty --tag-name-filter cat -- --all

# Remove the backup refs to make sure the changes take effect
echo "Cleaning up backup refs..."
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo "Git repository cleaning complete."
echo "IMPORTANT: You must now push these changes with 'git push --force' to all branches."
echo "Verify that the .env files have been removed from the history."
echo "To restore the backup if needed: rm -rf .git && mv .git.bak .git" 