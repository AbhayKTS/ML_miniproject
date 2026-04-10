#!/bin/bash
git filter-branch -f --env-filter '
    export GIT_AUTHOR_NAME="AbhayKTS"
    export GIT_AUTHOR_EMAIL="abhay88998@gmail.com"
    export GIT_COMMITTER_NAME="AbhayKTS"
    export GIT_COMMITTER_EMAIL="abhay88998@gmail.com"
' HEAD~30..HEAD
