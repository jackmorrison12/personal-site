import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { OutboundLink } from "gatsby-plugin-google-analytics"

export default ({ data }) => (
  <Layout>
    <SEO title="Archive" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1 className="margin-0-t is-title">Personal Website Archive</h1>
          <p>I have had many previous iterations of this site</p>
          <p>
            I've spent lots of time working on them all over the years, and so
            wanted to memorialise them all here
          </p>
          <p>
            They're all available on sub-domains of this site, hosted using
            GitHub Pages
          </p>
        </div>
        <div className="col-xs-12 col-sm-6 pad-3">
          <OutboundLink className="link" href="https://v0.jackmorrison.xyz">
            <div className="grow">
              <Img fluid={data.v0.childImageSharp.fluid} />
            </div>
          </OutboundLink>

          <p>
            I created a website back in Sixth Form as part of a lesson about
            HTML. It was never hosted anywhere, so I classed it as a v0.
          </p>
          <p>
            Available at{" "}
            <OutboundLink className="link" href="https://v0.jackmorrison.xyz">
              v0.jackmorrison.xyz
            </OutboundLink>
          </p>
        </div>
        <div className="col-xs-12 col-sm-6 pad-3">
          <OutboundLink className="link" href="https://v1.jackmorrison.xyz">
            <div className="grow">
              <Img fluid={data.v1.childImageSharp.fluid} />
            </div>
          </OutboundLink>
          <p>
            The first site I published was static HTML and CSS, and was hosted
            using GitHub Pages.
          </p>
          <p>
            Available at{" "}
            <OutboundLink className="link" href="https://v1.jackmorrison.xyz">
              v1.jackmorrison.xyz
            </OutboundLink>
          </p>
        </div>
        <div className="col-xs-12 col-sm-6 pad-3">
          <OutboundLink className="link" href="https://v2.jackmorrison.xyz">
            <div className="grow">
              <Img fluid={data.v2.childImageSharp.fluid} />
            </div>
          </OutboundLink>
          <p>
            The second generation was made using Jekyll, and converted my old
            design into something more sustainable.
          </p>
          <p>
            Available at{" "}
            <OutboundLink className="link" href="https://v2.jackmorrison.xyz">
              v2.jackmorrison.xyz
            </OutboundLink>
          </p>
        </div>
        <div className="col-xs-12 col-sm-6 pad-3">
          <OutboundLink className="link" href="https://v3.jackmorrison.xyz">
            <div className="grow">
              <Img fluid={data.v3.childImageSharp.fluid} />
            </div>
          </OutboundLink>
          <p>
            Version 3 of my site was created using react, and compiled using a
            GitHub Action, also hosted using GitHub Pages.
          </p>
          <p>
            Available at{" "}
            <OutboundLink className="link" href="https://v3.jackmorrison.xyz">
              v3.jackmorrison.xyz
            </OutboundLink>
          </p>
        </div>
      </div>
    </div>
  </Layout>
)

export const query = graphql`
  query {
    v0: file(relativePath: { eq: "site-archive/site_v0.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    v1: file(relativePath: { eq: "site-archive/site_v1.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    v2: file(relativePath: { eq: "site-archive/site_v2.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    v3: file(relativePath: { eq: "site-archive/site_v3.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
