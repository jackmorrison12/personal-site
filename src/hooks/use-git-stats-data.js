import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const useGitStatsData = () => {
  const data = useStaticQuery(graphql`
    {
      main: dataYaml(git_stats: { commits: { gt: 1 } }) {
        git_stats {
          message
          date
          commits
          hash
        }
      }
    }
  `)
  return data
}

export default useGitStatsData
