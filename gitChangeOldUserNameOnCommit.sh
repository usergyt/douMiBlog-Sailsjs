#!/bin/sh
git filter-branch --env-filter '
OLD_EMAIL="root@hzlinxv01.china.nsn-net.net"
CORRECT_NAME="linxiaowu66"
CORRECT_EMAIL="linguang661990@126.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

# git push --force --tags origin 'refs/heads/*'
