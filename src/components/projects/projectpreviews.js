/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'

class ProjectPreviews extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <div className="row margin-5-b">
        {
          posts &&
            posts.map(({ node: post }) => (
              <div className="grow col-xs-12 col-md-6 margin-5-t">
                <Link to={"/" + post.frontmatter.slug} className="link" id="path">
                  <div className="col-xs-12 col-md-8">
                    <h1 className="margin-0 is-light-grey">{post.frontmatter.title}</h1>
                    <p className="margin-0 margin-2-b is-black">
                      {post.frontmatter.date}
                    </p>
                    <div className="line-sm is-black margin-3-b" />
                    <p className="margin-0 is-black">{post.frontmatter.description}</p>
                    <p className="margin-0 is-light-grey">{post.frontmatter.tech.map((item) => (item)).join(', ')}</p>
                  </div>
                </Link>
              </div>
          ))
        }
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
};

export default () => (
  <StaticQuery
    query={graphql`
      query ProjectPreviewsQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___startdate] }
          filter: {
            fileAbsolutePath: {regex: "/projects/"  }
            frontmatter: {homepage: {eq: true}}
            }
          limit: 2
        ) {
          edges {
            node {
              id
              frontmatter {
                slug
                title
                description
                tech 
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <ProjectPreviews data={data} count={count} />}
  />
)