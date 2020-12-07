/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { graphql, StaticQuery } from "gatsby"

import Project from "./project"

class ProjectPreviews extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="row margin-5-b">
        {posts &&
          posts.map(({ node: post }) => <Project project={post.frontmatter} />)}
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
      query ProjectPreviewsv2Query {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___startdate] }
          filter: {
            fileAbsolutePath: { regex: "/projects/" }
            frontmatter: { homepage: { eq: true } }
          }
          limit: 2
        ) {
          edges {
            node {
              id
              frontmatter {
                fullurl
                title
                description
                tags
                startdate(formatString: "MMMM YYYY")
                enddate(formatString: "MMMM YYYY")
                hero {
                  childImageSharp {
                    fluid(maxWidth: 1000) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
                banner {
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
