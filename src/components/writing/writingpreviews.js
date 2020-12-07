/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { graphql, StaticQuery } from "gatsby"

import Writing from "./writing"

class ProjectPreviews extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="row margin-5-b">
        {posts &&
          posts.map(({ node: post }) => <Writing writing={post.frontmatter} />)}
      </div>
    )
  }
}
ProjectPreviews.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query WritingPreviewsQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              type: { regex: "/article|series/" }
              hidden: { eq: false }
            }
          }
          limit: 2
        ) {
          edges {
            node {
              excerpt(pruneLength: 200)
              id
              frontmatter {
                fullurl
                title
                description
                totalposts
                type
                tags
                date(formatString: "MMMM DD, YYYY")
                daystartdate: startdate(formatString: "MMMM DD, YYYY")
                enddate(formatString: "MMMM DD, YYYY")
                hero {
                  childImageSharp {
                    fluid(maxWidth: 1000) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
                logo {
                  childImageSharp {
                    fluid(maxWidth: 1000) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <ProjectPreviews data={data} count={count} />}
  />
)
