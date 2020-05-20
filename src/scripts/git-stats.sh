export git_commits=$(git rev-list --count HEAD)
export git_dates=$(git log -1 --date=format:'%A, %d %B at %H:%M:%S' --pretty=format:%cd)
export git_message=$(git log -1 --pretty=%B)

cd src/data 

echo "Generating git stats file..."

cat > git_stats.yml <<EOL
git-data:
  commits: ${git_commits}
  dates: ${git_dates}
  message: ${git_message}

EOL

cd ../..