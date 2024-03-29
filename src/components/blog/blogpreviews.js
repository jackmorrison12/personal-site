/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"

class BlogPreviews extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark
    return (
      <div className="row">
        {posts &&
          posts.map(({ node: post }) => (
            <div className="col-xs-12 col-md-6 margin-5-t grow margin-5-b">
              <Link to={"/" + post.frontmatter.fullurl} className="" id="path">
                <h3 className="margin-0 is-black">
                  {post.frontmatter.series}: Part {post.frontmatter.entry}
                </h3>
                <h1 className="margin-0 is-light-grey">
                  {post.frontmatter.title}
                </h1>
                <p className="margin-0 margin-1-b is-black">
                  {post.frontmatter.date}
                </p>
                <p className="margin-0 margin-1-b bold is-light-grey pad-2-b">
                  {post.frontmatter.description}
                </p>
                <div className="line-sm is-black margin-3-b" />
                <p className="margin-0 is-black ">{post.excerpt}</p>
              </Link>
            </div>
          ))}
      </div>
    )
  }
}

BlogPreviews.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogPreviewsQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            fileAbsolutePath: { regex: "/blog/" }
            frontmatter: { hidden: { eq: false } }
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
                series
                entry
                description
                date(formatString: "MMMM DD, YYYY")
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogPreviews data={data} count={count} />}
  />
)
