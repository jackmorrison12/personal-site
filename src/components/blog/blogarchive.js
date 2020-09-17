/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"

class BlogArchive extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark
    return (
      posts &&
      posts.map(({ node: post }) => (
        <Link to={"/" + post.frontmatter.fullurl} className="" id="path">
          <div className="grow row margin-5-b">
            <div className="col-xs-12 margin-5-t">
              <h3 className="margin-0 is-red">
                {post.frontmatter.series}: Part {post.frontmatter.entry}
              </h3>
              <h1 className="margin-0 is-medium-blue">
                {post.frontmatter.title}
              </h1>
              <p className="margin-0 margin-2-b is-black">
                {post.frontmatter.date}
              </p>
              <p className="margin-0 margin-1-b is-black bold is-red pad-2-b">
                {post.frontmatter.description}
              </p>
              <div className="line-sm is-black margin-3-b" />
              <p className="margin-0 is-black">{post.excerpt}</p>
            </div>
          </div>
        </Link>
      ))
    )
  }
}

BlogArchive.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogArchiveQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: { type: { regex: "/blog/" }, hidden: { eq: false } }
          }
        ) {
          edges {
            node {
              excerpt(pruneLength: 300)
              id
              frontmatter {
                title
                series
                entry
                description
                date(formatString: "MMMM DD, YYYY")
                fullurl
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogArchive data={data} count={count} />}
  />
)
