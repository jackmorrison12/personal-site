import React from "react"
import PropTypes from "prop-types"

import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  return (
    <Layout>
      <SEO title={tagHeader} />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-3-lr">
          <div className="col-xs-12">
            <h1 className="title margin-3-t margin-0-b">{tagHeader}</h1>
            <div>
              <ul>
                {edges.map(({ node }) => {
                  const { title, fullurl } = node.frontmatter
                  return (
                    <li key={fullurl}>
                      <Link to={fullurl}>{title}</Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            fullurl
          }
        }
      }
    }
  }
`
