#!/bin/bash

# This script uses BFG Repo-Cleaner to remove .env files from Git history

echo "Cleaning sensitive files from Git repository..."

# Check if BFG jar exists
if [ ! -f "bfg.jar" ]; then
    echo "Downloading BFG Repo-Cleaner..."
    curl -Lo bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
fi

# Create a backup of the repository
echo "Creating backup of the repository..."
cp -r .git .git.bak

# Run BFG to remove .env files
echo "Running BFG to remove sensitive files..."
java -jar bfg.jar --delete-files ".env" .

# Run BFG again for nested .env files
echo "Running BFG to remove nested .env files..."
java -jar bfg.jar --delete-files ".env" .

# Clean up the repository
echo "Cleaning up the repository..."
git reflog expire --expire=now --all && git gc --prune=now --aggressive

echo "Git repository cleaning complete."
echo "IMPORTANT: You must now push these changes with 'git push --force' to all branches."
echo "Run 'git status' to check the repository state."
echo "To restore the backup if needed: rm -rf .git && mv .git.bak .git" 