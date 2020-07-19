/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { series, blogposts } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = series
  const posts = blogposts.edges
  return (
    <Layout>
      <SEO title={frontmatter.title} />
      <div className="is-grey is-light-grey-bg">
        <div className="row container pad-10-t ">
          <div className="col-xs-12 pad-3-lr">
            <Link to="/writing" className="">
              <h2 className="is-medium-blue margin-0 margin-2-b link is-red pad-1-b inherit">{`< Blog`}</h2>
            </Link>
          </div>

          <div className="col-xs-12 pad-3-lr">
            <h1 className="title margin-3-t margin-0-b">{frontmatter.title}</h1>{" "}
            <h6 className="subtitle margin-3-b is-red">
              {frontmatter.description}
            </h6>
            <h6 className="subtitle margin-3-b">{frontmatter.date}</h6>
            <div className="line margin-5-tb is-red" />
            {/* <div className="blog" dangerouslySetInnerHTML={{ __html: html }} /> */}
          </div>
        </div>
        <div className="row container">
          {posts &&
            posts.map(({ node: post }) => (
              <Link to={"/" + post.frontmatter.fullurl} className="" id="path">
                <div className="grow row margin-5-b">
                  <div className="col-xs-12 margin-5-t">
                    <h3 className="margin-0 is-red">
                      {post.frontmatter.series}: Part {post.frontmatter.entry}
                    </h3>
                    <h1 className="margin-0 is-medium-blue">
                      {post.frontmatter.title}
                    </h1>
                    <p className="margin-0 margin-2-b is-black">
                      {post.frontmatter.date}
                    </p>
                    <p className="margin-0 margin-1-b is-black bold is-red pad-2-b">
                      {post.frontmatter.description}
                    </p>
                    <div className="line-sm is-black margin-3-b" />
                    <p className="margin-0 is-black">{post.excerpt}</p>
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
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
      }
    }
    blogposts: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        frontmatter: { blogseries: { eq: $slug }, baseurl: { eq: $baseurl } }
      }
    ) {
      edges {
        node {
          excerpt(pruneLength: 300)
          id
          frontmatter {
            title
            series
            entry
            description
            date(formatString: "MMMM DD, YYYY")
            fullurl
          }
        }
      }
    }
  }
`
