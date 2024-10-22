#!/bin/sh

cp /usr/share/nginx/html/settings.template.json /usr/share/nginx/html/settings.json

sed -i 's|{{INCIDENTS_API_URL}}|'${INCIDENTS_API_URL}'|g' /usr/share/nginx/html/settings.json
sed -i 's|{{INCIDENTS_SSE_URL}}|'${INCIDENTS_SSE_URL}'|g' /usr/share/nginx/html/settings.json
sed -i 's|{{PROCESS_URL}}|'${PROCESS_URL}'|g' /usr/share/nginx/html/settings.json

exec "$@"