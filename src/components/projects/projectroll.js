/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

class ProjectRoll extends React.Component {
  render() {
    const { data } = this.props
    const { edges: featured } = data.featured
    const { edges: non_featured } = data.non_featured

    return (
      <>
        <div className="row flex">
          {featured &&
            featured.map(({ node: post }) => (
              <div className="col-xs-12 col-sm-6 col-md-3 margin-3-b pad-5-lr">
                <div className="grow project featured is-white-bg">
                  <Link to={"/" + post.frontmatter.slug} className="" id="path">
                    <Img
                      fluid={post.frontmatter.banner.childImageSharp.fluid}
                    />
                    <div className="pad-2">
                      <h2 className="is-red margin-0">
                        {post.frontmatter.title}
                      </h2>
                      <p className=" margin-0-t margin-2-b is-black bold">
                        {post.frontmatter.startdate !== post.frontmatter.enddate
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
                        {post.frontmatter.tech.map(item => item).join(", ")}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
        <div className="row flex">
          {non_featured &&
            non_featured.map(({ node: post }) => (
              <div className="col-xs-12 col-md-6 margin-3-b pad-5-lr">
                <div className="grow project non-featured is-white-bg">
                  <Link to={"/" + post.frontmatter.slug} className="" id="path">
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
                            {post.frontmatter.tech.map(item => item).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </>
    )
  }
}
ProjectRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query ProjectRollQuery {
        featured: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___startdate] }
          filter: {
            fileAbsolutePath: { regex: "/projects/" }
            frontmatter: { featured: { eq: true } }
          }
        ) {
          edges {
            node {
              id
              frontmatter {
                slug
                title
                startdate(formatString: "MMMM YYYY")
                enddate(formatString: "MMMM YYYY")
                description
                tech
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
        non_featured: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___startdate] }
          filter: {
            fileAbsolutePath: { regex: "/projects/" }
            frontmatter: { featured: { eq: false }, hidden: { eq: false } }
          }
        ) {
          edges {
            node {
              id
              frontmatter {
                slug
                title
                startdate(formatString: "MMMM YYYY")
                enddate(formatString: "MMMM YYYY")
                description
                tech
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
    render={(data, count) => <ProjectRoll data={data} count={count} />}
  />
)
