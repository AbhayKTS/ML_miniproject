#!/bin/bash

echo "Recovering the original author history..."

# Look through the Git history backup (reflog) to find the exact moment right after we deleted the 123 fake commits, but BEFORE any author rewriting happened.
ORIGINAL_STATE=$(git reflog | grep "HEAD~123" | head -n 1 | awk '{print $1}')

if [ -z "$ORIGINAL_STATE" ]; then
    echo "Error: Could not find the backup state. Let me know and I will find it manually."
    exit 1
fi

echo "Restoring branch to state $ORIGINAL_STATE (AbhayKTS commits restored)..."
git reset --hard $ORIGINAL_STATE

echo "Applying the correct author changes (ONLY changing 'chhaya' to 'ansh-codr')..."

# Fetch your correct email
LOCAL_EMAIL=$(git config user.email)
if [ -z "$LOCAL_EMAIL" ]; then
    LOCAL_EMAIL="anshloverao@gmail.com"
fi

# Run the filter-branch to ONLY target commits by "chhaya"
git filter-branch -f --env-filter '
    # If the author name or email has "chhaya" in it, change it to ansh-codr
    if echo "$GIT_AUTHOR_NAME" | grep -qi "chhaya" || echo "$GIT_AUTHOR_EMAIL" | grep -qi "chhaya" || echo "$GIT_COMMITTER_NAME" | grep -qi "chhaya"; then
        export GIT_AUTHOR_NAME="ansh-codr"
        export GIT_COMMITTER_NAME="ansh-codr"
        export GIT_AUTHOR_EMAIL="'"$LOCAL_EMAIL"'"
        export GIT_COMMITTER_EMAIL="'"$LOCAL_EMAIL"'"
    fi
' HEAD

echo ""
echo "Done! AbhayKTS's commits are completely untouched. Only 'chhaya' commits are now yours."
echo ""
echo "To fix GitHub, please force push one last time:"
echo "git push origin main --force"
