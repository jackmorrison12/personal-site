import React from "react"
import PropTypes from "prop-types"

import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Project from "../components/projects/project"
import Writing from "../components/writing/writing"

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} item${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`
  const projCount = edges.filter(
    item => item.node.frontmatter.type === "project"
  ).length
  const articleCount = edges.filter(
    item => item.node.frontmatter.type === "article"
  ).length
  const blogCount = edges.filter(item => item.node.frontmatter.type === "blog")
    .length
  const seriesCount = edges.filter(
    item => item.node.frontmatter.type === "series"
  ).length

  return (
    <Layout>
      <SEO title={tagHeader} />
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="container-small ">
          <div className="row">
            <div className="col-xs-12">
              <h1 className="title title-borders margin-0-t">
                {totalCount +
                  " item" +
                  (totalCount === 1 ? "" : "s") +
                  " tagged with "}
                <span className="is-primary">"{tag}"</span>
              </h1>
            </div>
          </div>
          {projCount > 0 ? (
            <div className="row">
              <div className="col-xs-12">
                <h1>
                  {projCount} Project{projCount === 1 ? "" : "s"}
                </h1>
                <div className="row">
                  {edges
                    .filter(item => item.node.frontmatter.type === "project")
                    .map(({ node }) => (
                      <Project project={node.frontmatter} halfwidth={true} />
                    ))}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {articleCount > 0 ? (
            <div className="row">
              <div className="col-xs-12">
                <h1>
                  {articleCount} Article{articleCount === 1 ? "" : "s"}
                </h1>
                {edges
                  .filter(item => item.node.frontmatter.type === "article")
                  .map(({ node }) => (
                    <Writing writing={node.frontmatter} halfwidth={true} />
                  ))}
              </div>
            </div>
          ) : (
            ""
          )}
          {blogCount > 0 ? (
            <div className="row">
              <div className="col-xs-12">
                <h1>
                  {blogCount} Blog Post{blogCount === 1 ? "" : "s"}
                </h1>
                {edges
                  .filter(item => item.node.frontmatter.type === "blog")
                  .map(({ node }) => (
                    <Writing writing={node.frontmatter} halfwidth={true} />
                  ))}
              </div>
            </div>
          ) : (
            ""
          )}
          {seriesCount > 0 ? (
            <div className="row">
              <div className="col-xs-12">
                <h1>{seriesCount} Blog Series</h1>
                {edges
                  .filter(item => item.node.frontmatter.type === "series")
                  .map(({ node }) => (
                    <Writing writing={node.frontmatter} halfwidth={true} />
                  ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: {
        fields: [frontmatter___type, frontmatter___date]
        order: [ASC, DESC]
      }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            type
            fullurl
            title
            description
            tags
            series
            entry
            totalentries
            daystartdate: startdate(formatString: "MMMM DD, YYYY")
            startdate(formatString: "MMMM YYYY")
            enddate(formatString: "MMMM YYYY")
            date(formatString: "MMMM DD, YYYY")
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
            logo {
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
`
