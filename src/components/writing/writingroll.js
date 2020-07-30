/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

class WritingRoll extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="row">
        {posts &&
          posts.map(({ node: post }) => (
            <Link
              to={"/" + post.frontmatter.fullurl}
              className="grow margin-5-b col-xs-12"
              id="path"
            >
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-4 margin-5-t">
                  <Img fluid={post.frontmatter.hero.childImageSharp.fluid} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-8 margin-5-t">
                  <span class="is-red-bg pad-1 is-white float-right mobile-hide">
                    {post.frontmatter.type === "series"
                      ? "Blog Series"
                      : "Article"}
                  </span>
                  <h1 className="margin-0 is-red">{post.frontmatter.title}</h1>
                  <p className="margin-0 margin-2-b is-black">
                    {post.frontmatter.startdate &&
                    post.frontmatter.startdate !== post.frontmatter.date
                      ? post.frontmatter.startdate + " - "
                      : ""}
                    {post.frontmatter.date}
                  </p>
                  <span class="is-red-bg pad-1 is-white mobile-show-inline-block margin-2-b">
                    {post.frontmatter.type === "series"
                      ? "Blog Series"
                      : "Article"}
                  </span>
                  <div className="line-sm is-black margin-3-b" />
                  <p className="margin-0 is-black">{post.excerpt}</p>
                  {post.frontmatter.totalposts ? (
                    <p className="margin-0 is-black">
                      This series consists of{" "}
                      <b className="is-red">
                        {post.frontmatter.totalposts > 1
                          ? post.frontmatter.totalposts + " blog posts "
                          : post.frontmatter.totalposts === 1
                          ? "1 blog post "
                          : "No blog posts "}
                      </b>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    )
  }
}
WritingRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query WritingRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              type: { regex: "/article|series/" }
              hidden: { eq: false }
            }
          }
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
    render={(data, count) => <WritingRoll data={data} count={count} />}
  />
)
