#!/bin/bash
git_commits=$(git rev-list --count HEAD)
git_dates=$(git log -1 --date=format:'%A, %d %B at %H:%M' --pretty=format:%cd)
git_message=$(git log -1 --pretty=%s)
git_hash=$(git rev-parse HEAD)  

if [[ $git_message == *cms/blog* ]];
then
  git_message="Adds a blog post"
elif [[ $git_message == *cms/article* ]];
then
  git_message="Adds an article"
elif [[ $git_message == *cms/project* ]];
then
  git_message="Adds an project"
  elif [[ $git_message == *cms/education* ]];
then
  git_message="Adds some educational information"
  elif [[ $git_message == *cms/experience* ]];
then
  git_message="Adds some work experience"
elif [[ $git_message == Merge* ]];
then
git_message=$(git log -1 --pretty=%b)
fi

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