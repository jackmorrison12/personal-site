export git_commits=$(git rev-list --count HEAD)
export git_dates=$(git log -1 --date=format:'%A, %d %B at %H:%M' --pretty=format:%cd)
export git_message=$(git log -1 --pretty=%B)

cd src/data 

echo "Generating git stats file..."

cat > git_stats.yml <<EOL
git_stats:
  commits: ${git_commits}
  date: ${git_dates}
  message: ${git_message}

EOL

cd ../..