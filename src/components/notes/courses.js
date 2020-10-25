/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

import Tags from "../misc/tags"

class Courses extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="row flex">
        {posts &&
          posts.map(({ node: post }) => (
            <div className="col-xs-12 col-sm-6 col-md-4 margin-3-b pad-2-lr">
              <div className="grow project featured is-white-bg">
                <Link
                  to={"/" + post.frontmatter.fullurl}
                  className=""
                  id="path"
                >
                  <Img fluid={post.frontmatter.hero.childImageSharp.fluid} />
                  <div className="pad-2">
                    <h2 className="is-primary margin-0">
                      {post.frontmatter.title}
                    </h2>
                    <p className=" margin-0-tb is-black bold">
                      {post.frontmatter.startdate !== post.frontmatter.enddate
                        ? post.frontmatter.startdate +
                          " - " +
                          post.frontmatter.enddate
                        : post.frontmatter.enddate}
                    </p>
                    <Tags tags={post.frontmatter.tags} />
                  </div>
                </Link>
              </div>
            </div>
          ))}
      </div>
    )
  }
}
Courses.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query CoursesQuery {
        allMarkdownRemark(
          sort: { order: ASC, fields: [frontmatter___code] }
          filter: {
            frontmatter: { type: { regex: "/course/" }, hidden: { eq: false } }
          }
        ) {
          edges {
            node {
              excerpt(pruneLength: 200)
              id
              frontmatter {
                fullurl
                title
                code
                type
                tags
                startdate(formatString: "MMMM")
                enddate(formatString: "MMMM YYYY")
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
    render={(data, count) => <Courses data={data} count={count} />}
  />
)
