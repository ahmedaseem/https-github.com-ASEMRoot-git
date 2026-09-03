#!/usr/bin/env bash

BASE="http://127.0.0.1:5050/api"

for endpoint in \
    health \
    countries \
    cities \
    businesses \
    tourism \
    products \
    projects
do
    echo "===== /api/$endpoint ====="

    curl -fsS \
        -o /tmp/asem-response \
        -w "HTTP %{http_code} | TYPE %{content_type} | SIZE %{size_download}\n" \
        "$BASE/$endpoint"

    head -c 200 /tmp/asem-response
    echo
    echo
done
