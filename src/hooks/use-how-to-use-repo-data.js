import { useStaticQuery, graphql } from "gatsby"

const useHowToUseRepoData = () => {
  const { markdownRemark } = useStaticQuery(graphql`
    query HowToUseRepoQuery {
      markdownRemark(frontmatter: { slug: { eq: "how-to-use-repo" } }) {
        html
      }
    }
  `)
  return markdownRemark.html
}

export default useHowToUseRepoData
