/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

class ArticlePreviews extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      posts &&
      posts.map(({ node: post }) => (
        <Link to={"/" + post.frontmatter.fullurl} className="" id="path">
          <div className="grow row margin-5-b">
            <div className="col-xs-12 col-md-5 margin-5-t rounded">
              <Img fluid={post.frontmatter.hero.childImageSharp.fluid} />
            </div>
            <div className="col-xs-12 col-md-6 margin-5-t">
              <h1 className="margin-0 is-red">{post.frontmatter.title}</h1>
              <p className="margin-0 margin-2-b is-black">
                {post.frontmatter.date}
              </p>
              <div className="line-sm is-black margin-3-b" />
              <p className="margin-0 is-black">{post.excerpt}</p>
              <div className="margin-0 margin-1-t flex flex-wrap">
                {post.frontmatter.tags.map(item => (
                  <div class="is-red-bg is-white margin-2-b margin-1-r tag">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))
    )
  }
}
ArticlePreviews.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query ArticlePreviewsQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            fileAbsolutePath: { regex: "/articles/" }
            frontmatter: { hidden: { eq: false } }
          }
          limit: 2
        ) {
          edges {
            node {
              excerpt(pruneLength: 300)
              id
              frontmatter {
                fullurl
                title
                date(formatString: "MMMM DD, YYYY")
                tags
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
    render={(data, count) => <ArticlePreviews data={data} count={count} />}
  />
)
