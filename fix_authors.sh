#!/bin/bash

# Fetch your currently configured Git email
LOCAL_EMAIL=$(git config user.email)

# Fallback in case you haven't set an email locally
if [ -z "$LOCAL_EMAIL" ]; then
    LOCAL_EMAIL="ansh-codr@users.noreply.github.com"
fi

echo "Rewriting git history to update the author to ansh-codr <$LOCAL_EMAIL>..."

# Use filter-branch to update BOTH the name and the email on all commits
git filter-branch -f --env-filter "
    export GIT_AUTHOR_NAME='ansh-codr'
    export GIT_COMMITTER_NAME='ansh-codr'
    export GIT_AUTHOR_EMAIL='${LOCAL_EMAIL}'
    export GIT_COMMITTER_EMAIL='${LOCAL_EMAIL}'
" HEAD

echo ""
echo "Successfully updated both name and email for all commits!"
echo ""
echo "To upload these corrected commits to GitHub, please run:"
echo "git push origin main --force"
