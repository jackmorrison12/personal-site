#!/bin/sh
time=$(date +%s000)

cd src/data 

echo "🕐 Generated build time file"

cat > last_build.yml <<EOL
last_build: ${time}
EOL

cd ../..