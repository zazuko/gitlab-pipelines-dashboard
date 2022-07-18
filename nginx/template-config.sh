#!/bin/sh

set -eu

WEB_ROOT=/usr/share/nginx/html

OUTPUT="$WEB_ROOT/env.js"
TEMPLATE="$WEB_ROOT/env.template.js"

: "$GITLAB"
: "$OIDC_CLIENT_ID"
: "$PUBLIC_URL"
: "$SELECTED_TAGS"

envsubst < $TEMPLATE > $OUTPUT

rm -f "$TEMPLATE"
