#!/bin/sh

source .env

if [ -z "$SMEE_URL" ]; then
  echo "SMEE_URL is not defined. To connect webhooks locally, please define SMEE_URL in .env"
else
  echo "Running smee with SMEE_URL: $SMEE_URL"
  smee --url $SMEE_URL --path /api/github/webhooks --port 3001
fi

