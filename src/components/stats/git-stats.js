import React from "react"
import useGitStatsData from "../../hooks/use-git-stats-data"
import Emoji from "a11y-react-emoji"
import TimeAgo from "react-timeago"
import { OutboundLink } from "gatsby-plugin-google-analytics"

export default props => {
  var data = useGitStatsData()
  data = data.main.git_stats
  const repo_name = "personal-site"
  const github_username = "jackmorrison12"
  return (
    <>
      <h2>
        This repo has{" "}
        <OutboundLink
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
        </OutboundLink>{" "}
        commits. The most recent commit was on{" "}
        <OutboundLink
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
        </OutboundLink>{" "}
        and it{" "}
        <OutboundLink
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
        </OutboundLink>
        .
      </h2>
      <p>
        <Emoji symbol="😻" label="cat" /> Data sourced using{" "}
        <OutboundLink
          className="link"
          href="https://github.com/jackmorrison12/personal-site/blob/master/src/scripts/git-stats.sh"
        >
          git terminal commands & a shell script
        </OutboundLink>
        , accurate as of last build (<TimeAgo date={props.last_build} />)
      </p>
    </>
  )
}
