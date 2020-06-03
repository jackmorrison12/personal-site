import { useStaticQuery, graphql } from "gatsby"

const useStatsData = () => {
  const data = useStaticQuery(graphql`
    {
      header: dataYaml(SUM: { code: { gt: 1 } }) {
        SUM {
          code
          nFiles
        }
      }
      languages: dataYaml(JavaScript: { code: { gt: 1 } }) {
        JavaScript {
          name
          nFiles
          comment
          code
          blank
        }
        Sass {
          blank
          code
          comment
          nFiles
          name
        }
        Markdown {
          blank
          code
          comment
          nFiles
          name
        }
        JSON {
          blank
          nFiles
          code
          comment
          name
        }
      }
    }
  `)
  return data
}

export default useStatsData
