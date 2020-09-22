/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Tags from "../components/misc/tags"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <SEO
        title={frontmatter.title}
        image={"/img/" + frontmatter.banner.childImageSharp.fluid.originalName}
        description={frontmatter.description}
      />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-10-t">
          <div className="col-xs-12">
            {"< "}
            <Link to={"/projects"} className="">
              <h3 className="margin-0 margin-2-b link is-primary pad-1-b inherit">{`All Projects`}</h3>
            </Link>
          </div>
        </div>
        <div className="row container">
          <div className="col-xs-12 col-sm-7 pad-3-lr">
            <h1 className="title margin-1-t margin-1-b">{frontmatter.title}</h1>
            <h6 className="subtitle margin-3-b italic">
              {frontmatter.description}
            </h6>
            <h6 className="subtitle margin-3-b">
              {frontmatter.startdate !== frontmatter.enddate
                ? frontmatter.startdate + " - " + frontmatter.enddate
                : frontmatter.startdate}
            </h6>
            <div className="line margin-5-tb is-primary" />
          </div>
          <div className="col-xs-12 col-sm-3 pad-3-lr pad-5-b">
            <div className="pad-3-lr pad-1-tb is-white-bg rounded">
              <div className="margin-0 margin-2-t pad-1-l flex flex-wrap">
                {frontmatter.sources
                  ? frontmatter.sources.map(item => (
                      <OutboundLink href={item.url}>
                        <div class="is-medium-blue-bg is-white margin-1-r tag margin-2-b grow-2">
                          {item.name}
                        </div>
                      </OutboundLink>
                    ))
                  : ""}
              </div>
              <div className="pad-1-l">
                <Tags tags={frontmatter.tags} />
              </div>
            </div>
          </div>
          <div className="col-xs-12 mobile-show">
            <div className="margin-auto pad-3-lr rounded">
              <Img fluid={frontmatter.banner.childImageSharp.fluid} />
            </div>
          </div>
          <div className="col-sm-2 mobile-hide">
            <div className="margin-auto rounded">
              <Img fluid={frontmatter.hero.childImageSharp.fluid} />
            </div>
          </div>
          <div className="col-xs-12 pad-3-lr">
            <div
              className="project-wrapper"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
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
        slug
        title
        type
        description
        tags
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
        banner {
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
