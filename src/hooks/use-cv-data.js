import { useStaticQuery, graphql } from "gatsby"

const useCvData = () => {
  const data = useStaticQuery(graphql`
    {
      basics: dataJson(name: { ne: null }) {
        name
      }
      socials: allSocialsJson(filter: { cv: { eq: true } }) {
        nodes {
          username
          url
          name
          icon
        }
      }
      education: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___enddate] }
        filter: {
          fileAbsolutePath: { regex: "/education/" }
          frontmatter: { cv: { eq: true } }
        }
      ) {
        nodes {
          frontmatter {
            title
            subtitle
            url
            startdate(formatString: "YYYY")
            enddate(formatString: "YYYY")
            grade_summaries {
              grade
            }
          }
        }
      }
      experience: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___enddate] }
        filter: {
          fileAbsolutePath: { regex: "/experience/" }
          frontmatter: { cv: { eq: true } }
        }
      ) {
        nodes {
          frontmatter {
            title
            subtitle
            url
            startdate(formatString: "MMMM YYYY")
            enddate(formatString: "MMMM YYYY")
            longhighlights {
              highlight
            }
          }
        }
      }
      languages: allLanguagesJson(
        filter: { languages: { elemMatch: { cv: { eq: true } } } }
      ) {
        nodes {
          languages {
            name
          }
          name
        }
      }
      skills: allSkillsJson(filter: { cv: { eq: true } }) {
        nodes {
          summary
          name
        }
      }
      projects: allMarkdownRemark(
        sort: {
          order: [ASC, DESC]
          fields: [frontmatter___hidden, frontmatter___enddate]
        }
        filter: {
          fileAbsolutePath: { regex: "/projects/" }
          frontmatter: { cv: { eq: true } }
        }
      ) {
        nodes {
          frontmatter {
            title
            slug
            startdate(formatString: "MMMM YYYY")
            enddate(formatString: "MMMM YYYY")
            highlights {
              highlight
            }
          }
        }
      }
    }
  `)
  return data
}

export default useCvData
