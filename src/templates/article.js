/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Tags from "../components/misc/tags"
import ShareSheet from "../components/misc/sharesheet"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const {
    article: { frontmatter, html },
    site: {
      siteMetadata: { url, author },
    },
  } = data
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        image={"/img/" + frontmatter.hero.childImageSharp.fluid.originalName}
        description={frontmatter.description}
      />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-10-t">
          <div className="col-xs-12">
            {"< "}
            <Link to={"/writing"} className="">
              <h3 className="margin-0 margin-2-b link is-primary pad-1-b inherit">{`All Articles`}</h3>
            </Link>
          </div>
        </div>
        <div className="row container pad-3-lr">
          <div className="col-xs-12 col-md-7">
            <h1 className="title margin-1-t margin-3-b">{frontmatter.title}</h1>
            <h6 className="subtitle margin-3-b">{frontmatter.date}</h6>
            <Tags tags={frontmatter.tags} />
            <div className="line margin-5-tb is-primary" />
          </div>
          <div className="col-xs-12 col-md-5 rounded">
            <div>
              <Img fluid={frontmatter.hero.childImageSharp.fluid} />
            </div>
          </div>
          <div className="blog" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="col-xs-12 margin-10-b">
            <div className="line-sm margin-5-tb is-primary" />
            <h4 className="subtitle margin-5-t margin-3-b">
              Enjoyed this article? Why not share it...
            </h4>
            <ShareSheet
              socialConfig={{
                author,
                config: {
                  url: `${url}${frontmatter.fullurl}`,
                  title: frontmatter.title,
                },
              }}
              tags={frontmatter.tags}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query($slug: String!, $baseurl: String!) {
    site {
      siteMetadata {
        url
        author
      }
    }
    article: markdownRemark(
      frontmatter: { slug: { eq: $slug }, baseurl: { eq: $baseurl } }
    ) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        tags
        fullurl
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
