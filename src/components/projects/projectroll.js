/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import Img from 'gatsby-image'


class ProjectRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <div className="row flex">
        {posts &&
          posts.map(({ node: post }) => (
            <div className="col-xs-12 col-md-3 margin-3-b">
              <div className="grow project is-white-bg">
                <Link to={"/" + post.frontmatter.slug} className="" id="path">

                  <Img fluid={post.frontmatter.hero.childImageSharp.fluid} />
                  <div className="pad-2">
                    <h2 className="is-red margin-0">{post.frontmatter.title}</h2>
                    <p className=" margin-0-t margin-2-b is-black bold">
                      {post.frontmatter.startdate !== post.frontmatter.enddate ? post.frontmatter.startdate + " - " + post.frontmatter.enddate : post.frontmatter.startdate}
                    </p>
                    <div className="line-sm is-black margin-3-b" />
                    <p className="margin-0 is-black">{post.frontmatter.description}</p>
                    <p className="margin-0 is-red">{post.frontmatter.tech.map((item) => (item)).join(', ')}</p>
                  </div>
                </Link>
              </div>
            </div>
        ))}
      </div>
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
          sort: { order: DESC, fields: [frontmatter___startdate] }
          filter: {
            fileAbsolutePath: {regex: "/projects/"  }
            frontmatter: {hidden: {eq: false}}
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
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <ProjectRoll data={data} count={count} />}
  />
)