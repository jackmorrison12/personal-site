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
            <div className="col-xs-12 col-md-6 margin-3-b">
              <div className="grow project non-featured is-light-grey-bg">
                <Link
                  to={"/" + post.frontmatter.fullurl}
                  className=""
                  id="path"
                >
                  <div className="row">
                    <div className="col-xs-12 pad-0 mobile-show">
                      <Img
                        fluid={post.frontmatter.banner.childImageSharp.fluid}
                      />
                    </div>
                    <div className="col-sm-4 pad-0 mobile-hide">
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
                          {post.frontmatter.startdate !==
                          post.frontmatter.enddate
                            ? post.frontmatter.startdate +
                              " - " +
                              post.frontmatter.enddate
                            : post.frontmatter.startdate}
                        </p>
                        <div className="line-sm is-black margin-3-b" />
                        <p className="margin-0 is-black">
                          {post.frontmatter.description}
                        </p>
                        <p className="margin-0 is-red">
                          {post.frontmatter.tags.map(item => item).join(", ")}
                        </p>
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
      query ProjectPreviewsQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___startdate] }
          filter: {
            fileAbsolutePath: { regex: "/projects/" }
            frontmatter: { homepage: { eq: true } }
          }
          limit: 2
        ) {
          edges {
            node {
              id
              frontmatter {
                fullurl
                title
                description
                tags
                hero {
                  childImageSharp {
                    fluid(maxWidth: 1000) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
                banner {
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
