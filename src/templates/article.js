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
      <SEO
        title={frontmatter.title}
        image={"/img/" + frontmatter.hero.childImageSharp.fluid.originalName}
        description={frontmatter.description}
      />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-10-t pad-3-lr">
          <div className="col-xs-12">
            <Link to="/writing" className="">
              <h2 className="is-medium-blue margin-0 margin-2-b link is-red pad-1-b inherit">{`< Articles`}</h2>
            </Link>
          </div>
          <div className="col-xs-12 col-md-7">
            <h1 className="title margin-1-t margin-5-b">{frontmatter.title}</h1>
            <h6 className="subtitle margin-3-b">{frontmatter.date}</h6>
            <div className="line margin-5-tb is-red" />
          </div>
          <div className="col-xs-12 col-md-5">
            <div>
              <Img fluid={frontmatter.hero.childImageSharp.fluid} />
            </div>
          </div>
          <div className="blog" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query($slug: String!, $baseurl: String!) {
    markdownRemark(
      frontmatter: { slug: { eq: $slug }, baseurl: { eq: $baseurl } }
    ) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        hero {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
              originalName
            }
          }
        }
      }
    }
  }
`
