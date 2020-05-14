/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Img from 'gatsby-image'


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
        <div className="row container pad-10-t pad-5-lr">
          <div className="col-xs-12">
            <Link to="/articles" className="">
              <h2 className="is-medium-blue margin-0 margin-2-b link is-red pad-1-b inherit">{`< Articles`}</h2>
            </Link>
          </div>
            <div className="col-xs-12 col-md-6">
              <h1 className="is-hero-menu margin-1-t margin-5-b">
                {frontmatter.title}
              </h1>
              <h6 className="is-hero-sub-text margin-3-b">
                {frontmatter.date}
              </h6>
              <div className="line margin-5-tb is-red" />

            </div>
            <div className="col-xs-12 col-md-6">
              <div ><Img fluid={frontmatter.hero.childImageSharp.fluid} /></div>
            </div>
            <div
                className="blog"
                dangerouslySetInnerHTML={{ __html: html }}
                />
          </div>
      </div>
    </Layout>

  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path} }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
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