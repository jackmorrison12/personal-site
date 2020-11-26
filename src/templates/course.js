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

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  var { course, notes } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = course
  notes = notes.edges
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
            <Link to={"/notes"} className="">
              <h3 className="margin-0 margin-2-b link is-primary pad-1-b inherit">{`All Courses`}</h3>
            </Link>
          </div>
        </div>
        <div className="row container pad-3-lr">
          <div className="col-xs-12 col-md-7">
            <h1 className="title margin-3-t margin-0-b">{frontmatter.title}</h1>
            <h2 className="margin-0-t is-primary">CO{frontmatter.code}</h2>
            <h6 className="subtitle margin-3-b">
              {frontmatter.startdate !== frontmatter.enddate
                ? frontmatter.startdate + " - " + frontmatter.enddate
                : frontmatter.enddate}
            </h6>
            <Tags tags={frontmatter.tags} />
            <div className="line margin-5-tb is-primary" />
          </div>
          <div className="col-xs-12 col-md-5 rounded">
            <div>
              <Img fluid={frontmatter.hero.childImageSharp.fluid} />
            </div>
          </div>
        </div>
        <div className="row container pad-5-lr">
          <div className="blog" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className="container pad-3-lr pad-10-b">
          {notes &&
            notes.map(({ node: note }) => (
              <Link to={"/" + note.frontmatter.fullurl} className="" id="path">
                <div className="grow-1 row margin-5-tb is-white-bg rounded pad-3 margin-1-lr">
                  <div className="col-xs-12">
                    <h1 className="margin-0 is-black">
                      {note.frontmatter.topic}: {note.frontmatter.title}
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query($slug: String!, $baseurl: String!) {
    course: markdownRemark(
      frontmatter: { slug: { eq: $slug }, baseurl: { eq: $baseurl } }
    ) {
      html
      frontmatter {
        slug
        title
        code
        startdate(formatString: "MMMM")
        enddate(formatString: "MMMM YYYY")
        tags
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
    notes: allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___topic] }
      filter: {
        frontmatter: {
          course: { eq: $slug }
          baseurl: { eq: $baseurl }
          hidden: { eq: false }
        }
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            topic
            tags
            fullurl
          }
        }
      }
    }
  }
`
