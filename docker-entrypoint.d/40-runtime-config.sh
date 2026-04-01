#!/bin/sh
set -eu

: "${APP_API_BASE_URL:=/api}"
: "${APP_API_ORIGIN:=}"

export APP_API_BASE_URL
export APP_API_ORIGIN

envsubst '${APP_API_BASE_URL} ${APP_API_ORIGIN}' \
  < /usr/share/nginx/html/runtime-config.template.js \
  > /usr/share/nginx/html/runtime-config.js
