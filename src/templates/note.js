/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Tags from "../components/misc/tags"
import ShareSheet from "../components/misc/sharesheet"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const {
    post: { frontmatter, html },
    site: {
      siteMetadata: { url, author },
    },
    course: { frontmatter: course_frontmatter },
  } = data
  return (
    <Layout>
      <SEO
        title={course_frontmatter.title + ": " + frontmatter.title}
        image={
          "/img/" + course_frontmatter.hero.childImageSharp.fluid.originalName
        }
      />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-10-t">
          <div className="col-xs-12">
            {"< "}
            <Link to={"/notes"} className="">
              <h3 className="margin-0 margin-2-b link is-primary pad-1-b inherit">{`All Courses`}</h3>
            </Link>{" "}
            {"< "}
            <Link to={frontmatter.baseurl + frontmatter.course} className="">
              <h3 className="margin-0 margin-2-b link is-primary pad-1-b inherit">
                {course_frontmatter.title}
              </h3>
            </Link>
          </div>
        </div>
        <div className="row container pad-3-lr">
          <div className="col-xs-12">
            <h1 className="title margin-3-t margin-0-b">
              {frontmatter.topic} : {frontmatter.title}
            </h1>
            <Tags tags={frontmatter.tags} />
          </div>
          <div className="note" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="col-xs-12 margin-10-b">
            <div className="line-sm margin-5-tb is-primary" />
            <h4 className="subtitle margin-5-t margin-3-b">
              Found these notes useful? Why not share them...
            </h4>
            <ShareSheet
              socialConfig={{
                author,
                config: {
                  url: `${url}${frontmatter.fullurl}`,
                  title: course_frontmatter.title + ": " + frontmatter.title,
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
  query($slug: String!, $course: String!, $baseurl: String!) {
    site {
      siteMetadata {
        url
        author
      }
    }
    course: markdownRemark(
      frontmatter: { slug: { eq: $course }, baseurl: { eq: $baseurl } }
    ) {
      html
      frontmatter {
        slug
        title
        code
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
    post: markdownRemark(
      frontmatter: {
        slug: { eq: $slug }
        course: { eq: $course }
        baseurl: { eq: $baseurl }
      }
    ) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        topic
        course
        baseurl
        tags
        fullurl
      }
    }
  }
`
