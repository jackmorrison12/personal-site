import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"


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
            <Link to="/articles" className="">
              <h2 className="is-medium-blue margin-0 margin-2-b btn pad-1-b inherit">{`< Articles`}</h2>
            </Link>
          </div>

          <div className="col-xs-12 pad-5-lr">
            <h1 className="is-hero-menu is-pink-always margin-1-t margin-5-b">
              {frontmatter.title}
            </h1>
            <h6 className="is-hero-sub-text margin-3-b">
              {frontmatter.date}
            </h6>
            <div className="line margin-5-tb is-red" />
            <div
                className="blog"
                dangerouslySetInnerHTML={{ __html: html }}
                />
          </div>
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
      }
    }
  }
`