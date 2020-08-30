/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

class ProjectPreviews extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="row margin-5-b">
        {posts &&
          posts.map(({ node: post }) => (
            <div className="col-xs-12 margin-3-b">
              <div className="grow project non-featured is-white-bg">
                <Link
                  to={"/" + post.frontmatter.fullurl}
                  className=""
                  id="path"
                >
                  <div className="row">
                    <div className="col-sm-4 pad-0">
                      <Img
                        fluid={post.frontmatter.hero.childImageSharp.fluid}
                      />
                    </div>
                    <div className="col-xs-12 col-sm-8">
                      <div className="pad-2 pad-5-t">
                        <h2 className="is-red margin-0">
                          {post.frontmatter.title}
                        </h2>
                        <p className=" margin-0-t margin-2-b is-black bold">
                          {post.frontmatter.startdate &&
                          post.frontmatter.startdate !== post.frontmatter.date
                            ? post.frontmatter.startdate + " - "
                            : ""}
                          {post.frontmatter.date}
                        </p>
                        <div className="line-sm is-black margin-3-b" />
                        <p className="margin-0 is-black">{post.excerpt}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
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
                totalposts
                type
                date(formatString: "MMMM DD, YYYY")
                startdate(formatString: "MMMM DD, YYYY")
                enddate(formatString: "MMMM DD, YYYY")
                hero {
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
