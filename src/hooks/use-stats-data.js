import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const useStatsData = () => {
  const data = useStaticQuery(graphql`
    {
      header: dataYaml {
        header {
          n_files
          n_lines
        }
      }
      languages: dataYaml {
        JavaScript {
          name
          nFiles
          comment
          code
          blank
        }
        JSON {
          blank
          nFiles
          code
          comment
          name
        }
        Markdown {
          blank
          code
          comment
          nFiles
          name
        }
        Sass {
          blank
          code
          comment
          nFiles
          name
        }
      }
    }
  `)
  return data
}

export default useStatsData
