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
  const { series, blogposts } = data // data.markdownRemark holds your post data
  const { frontmatter } = series
  const posts = blogposts.edges
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
              <h3 className="margin-0 margin-2-b link is-primary pad-1-b inherit">{`All Series`}</h3>
            </Link>
          </div>
        </div>
        <div className="row container pad-3-lr">
          <div className="col-xs-12 col-md-7">
            <h1 className="title margin-3-t margin-0-b">{frontmatter.title}</h1>{" "}
            <h6 className="subtitle margin-3-b is-primary">
              {frontmatter.description}
            </h6>
            <h6 className="subtitle margin-3-b">
              {frontmatter.startdate !== frontmatter.enddate
                ? frontmatter.startdate + " - " + frontmatter.enddate
                : frontmatter.startdate}
            </h6>
            <h6 className="subtitle margin-3-b">
              {frontmatter.totalposts > 1
                ? frontmatter.totalposts + " posts"
                : frontmatter.totalposts === 1
                ? "1 post"
                : "No posts"}
            </h6>
            <Tags tags={frontmatter.tags} />
            <div className="line margin-5-tb is-primary" />
            {/* <div className="blog" dangerouslySetInnerHTML={{ __html: html }} /> */}
          </div>
          <div className="col-xs-12 col-md-5 rounded">
            <div>
              <Img fluid={frontmatter.hero.childImageSharp.fluid} />
            </div>
          </div>
        </div>
        <div className="container pad-3-lr pad-10-b">
          {posts &&
            posts.map(({ node: post }) => (
              <Link to={"/" + post.frontmatter.fullurl} className="" id="path">
                <div className="grow-1 row margin-5-tb is-white-bg rounded pad-3 margin-1-lr">
                  <div className="col-xs-12 col-md-3 flex flex-wrap">
                    <h1 className="margin-0 is-black left-xs right-md width-full last-xs first-md">
                      {post.frontmatter.date}
                    </h1>
                    <p className="margin-0 is-primary bold is-black left-xs right-md width-full">
                      Part {post.frontmatter.entry}
                    </p>
                  </div>
                  <div className="col-xs-12 col-md-9">
                    <h1 className="margin-0 is-primary">
                      {post.frontmatter.title}
                    </h1>

                    <p className="margin-0 is-black bold is-black">
                      {post.frontmatter.description}
                    </p>
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
    series: markdownRemark(
      frontmatter: { slug: { eq: $slug }, baseurl: { eq: $baseurl } }
    ) {
      html
      frontmatter {
        slug
        title
        description
        startdate(formatString: "MMMM DD, YYYY")
        enddate(formatString: "MMMM DD, YYYY")
        totalposts
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
    blogposts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: {
          blogseries: { eq: $slug }
          baseurl: { eq: $baseurl }
          hidden: { eq: false }
        }
      }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          frontmatter {
            title
            series
            entry
            description
            date(formatString: "MMM DD, YYYY")
            fullurl
          }
        }
      }
    }
  }
`
