#!/bin/sh
git_commits=$(git rev-list --count HEAD)
git_dates=$(git log -1 --date=format:'%A, %d %B at %H:%M' --pretty=format:%cd)
git_message=$(git log -1 --pretty=%s)
git_hash=$(git rev-parse HEAD)  

cd src/data 

echo "📈 Generating git stats file..."

cat > git_stats.yml <<EOL
git_stats:
  commits: ${git_commits}
  date: ${git_dates}
  message: "${git_message}"
  hash: ${git_hash}

EOL

cd ../..