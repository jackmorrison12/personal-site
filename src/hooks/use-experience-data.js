import { useStaticQuery, graphql } from "gatsby"

export const useExperienceData = () => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
        query ExperienceDataQuery {
            allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___enddate] }
                filter: {
                    fileAbsolutePath: {regex: "/experience/"  }
                    frontmatter: {hidden: {eq: false}}
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
                            shorthighlights {
                                highlight
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