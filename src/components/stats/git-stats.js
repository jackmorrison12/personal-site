import React from "react"
import useGitStatsData from "../../hooks/use-git-stats-data"
import Emoji from "a11y-react-emoji"

export default () => {
  var data = useGitStatsData()
  data = data.main.git_stats
  return (
    <>
      <h2>
        This repo has <span className="is-green">{data.commits}</span> commits.
        The most recent commit was on{" "}
        <span className="is-green">{data.date}</span> and it{" "}
        <span className="is-green">{data.message.toLowerCase()}</span>.
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
