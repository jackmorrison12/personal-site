/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'

class ProjectRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      posts &&
        posts.map(({ node: post }) => (
          <Link to={"/" + post.frontmatter.slug} className="link" id="path">
            <div className="grow row margin-5-b">
              <div className="col-xs-12 margin-5-t">
                <h1 className="margin-0 is-red">{post.frontmatter.title}</h1>
                <p className="margin-0 margin-2-b is-black">
                  {post.frontmatter.date}
                </p>
                <div className="line-sm is-black margin-3-b" />
                <p className="margin-0 is-black">{post.frontmatter.description}</p>
                <p className="margin-0 is-black">{post.frontmatter.tech.map((item) => (item)).join(', ')}</p>

              </div>
            </div>
          </Link>
      ))
    )
  }
}
ProjectRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query ProjectRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {fileAbsolutePath: {regex: "/projects/"  }}
        ) {
          edges {
            node {
              id
              frontmatter {
                slug
                title
                date(formatString: "MMMM DD, YYYY")
                description
                tech 
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <ProjectRoll data={data} count={count} />}
  />
)