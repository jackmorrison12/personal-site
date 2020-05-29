/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

class ArticleRoll extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="row">
        {posts &&
          posts.map(({ node: post }) => (
            <Link
              to={"/" + post.frontmatter.slug}
              className="grow margin-5-b col-xs-12"
              id="path"
            >
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-4 margin-5-t">
                  <Img fluid={post.frontmatter.hero.childImageSharp.fluid} />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-8 margin-5-t">
                  <h1 className="margin-0 is-red">{post.frontmatter.title}</h1>
                  <p className="margin-0 margin-2-b is-black">
                    {post.frontmatter.date}
                  </p>
                  <div className="line-sm is-black margin-3-b" />
                  <p className="margin-0 is-black">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    )
  }
}
ArticleRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query ArticleRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            fileAbsolutePath: { regex: "/articles/" }
            frontmatter: { hidden: { eq: false } }
          }
        ) {
          edges {
            node {
              excerpt(pruneLength: 200)
              id
              frontmatter {
                slug
                title
                date(formatString: "MMMM DD, YYYY")
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
    render={(data, count) => <ArticleRoll data={data} count={count} />}
  />
)
