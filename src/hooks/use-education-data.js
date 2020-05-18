import { useStaticQuery, graphql } from "gatsby"

export const useEducationData = () => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      query EducationDataQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___enddate] }
          filter: {
            fileAbsolutePath: { regex: "/education/" }
            frontmatter: { hidden: { eq: false } }
          }
        ) {
          edges {
            node {
              html
              frontmatter {
                slug
                title
                subtitle
                url
                highlights {
                  name
                  score
                }
                commendations {
                  name
                  awarder
                  date(formatString: "MMMM YYYY")
                }
              }
            }
          }
        }
      }
    `
  )
  return allMarkdownRemark.edges
}
