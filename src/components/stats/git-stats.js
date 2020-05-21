import React from "react"
import useGitStatsData from "../../hooks/use-git-stats-data"
import Emoji from "a11y-react-emoji"

export default () => {
  var data = useGitStatsData()
  data = data.main.git_stats
  const repo_name = "personal-site"
  const github_username = "jackmorrison12"
  return (
    <>
      <h2>
        This repo has{" "}
        <a
          href={
            "https://github.com/" +
            github_username +
            "/" +
            repo_name +
            "/commits/master"
          }
          className="link is-green"
        >
          <span className="is-green">{data.commits}</span>
        </a>{" "}
        commits. The most recent commit was on{" "}
        <a
          href={
            "https://github.com/" +
            github_username +
            "/" +
            repo_name +
            "/commit/" +
            data.hash
          }
          className="link is-green"
        >
          <span className="is-green">{data.date}</span>
        </a>{" "}
        and it{" "}
        <a
          href={
            "https://github.com/" +
            github_username +
            "/" +
            repo_name +
            "/commit/" +
            data.hash
          }
          className="link is-green"
        >
          <span className="is-green">{data.message.toLowerCase()}</span>
        </a>
        .
      </h2>
      <p>
        <Emoji symbol="😻" label="cat" /> Data sourced using{" "}
        <a
          className="link"
          href="https://github.com/jackmorrison12/personal-site/blob/master/src/scripts/git-stats.sh"
        >
          git terminal commands & a shell script
        </a>
        , accurate as of last build
      </p>
    </>
  )
}
