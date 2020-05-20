/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <SEO title={frontmatter.title} />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-10-t ">
          <div className="col-xs-12 pad-5-lr">
            <Link to="/projects" className="">
              <h2 className="is-medium-blue margin-0 margin-2-b link is-red pad-1-b inherit">{`< Projects`}</h2>
            </Link>
          </div>
          <div className="col-xs-12 col-sm-10 pad-5-lr">
            <h1 className="is-title margin-1-t margin-1-b">
              {frontmatter.title}
            </h1>
            <h6 className="is-subtitle margin-3-b italic">
              {frontmatter.description}
            </h6>
            <h6 className="is-subtitle margin-3-b">
              {frontmatter.startdate !== frontmatter.enddate
                ? frontmatter.startdate + " - " + frontmatter.enddate
                : frontmatter.startdate}
            </h6>
            <div className="line margin-5-tb is-red" />
          </div>
          <div className="col-xs-12 col-sm-2">
            {frontmatter.hero ? (
              <div className="project-logo">
                <Img fluid={frontmatter.hero.childImageSharp.fluid} />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-xs-12 pad-5-lr">
            <div className="float-right margin-3 pad-5-lr col-xs-12 col-sm-4 is-white-bg">
              {frontmatter.sources ? (
                <p>
                  Source code/examples can be found on{" "}
                  {frontmatter.sources
                    .map(item => (
                      <span className="link">
                        <a href={item.url}>{item.name}</a>
                      </span>
                    ))
                    .reduce((acc, curr, i) =>
                      i !== 0
                        ? [
                            acc,
                            `${
                              Object.entries(frontmatter.sources).length - 1 ===
                              i
                                ? ` and`
                                : ", "
                            }
                  `,
                            curr,
                          ]
                        : curr
                    )}
                </p>
              ) : (
                ""
              )}

              {frontmatter.tech ? (
                <p>
                  Written using{" "}
                  {frontmatter.tech
                    .map(item => <span className="is-red">{item}</span>)
                    .reduce((acc, curr, i) =>
                      i !== 0
                        ? [
                            acc,
                            `${
                              Object.entries(frontmatter.tech).length - 1 === i
                                ? ` and  `
                                : ", "
                            }`,
                            curr,
                          ]
                        : curr
                    )}{" "}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="blog" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path } }) {
      html
      frontmatter {
        slug
        title
        type
        description
        tech
        startdate(formatString: "MMMM YYYY")
        enddate(formatString: "MMMM YYYY")
        sources {
          name
          url
          icon
        }
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
`
