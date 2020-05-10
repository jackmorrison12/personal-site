import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const imgGridStyle = {
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, 200px)`
};

export default ({ data }) => (
  <Layout>
    <SEO title="Me" />
    <div className="is-grey is-light-grey-bg ">
      <div className=" pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1 className="is-hero-menu margin-0-t">Hey 👋 I'm Jack</h1>
            <div className="line margin-3-t margin-10-b" />
          </div>
          <div className="col-xs-12 col-md-12">
          </div>
        </div>
      </div>
      <div className="row ">
          {data.allFile.edges.map(edge => 
            <div className="col-xs-4 col-sm-2 pad-0">
              <Img style={{opacity: 0.2}} fluid={edge.node.childImageSharp.fluid} />
            </div>
          )}     
      </div>
      
    </div>
  </Layout>
)

export const query = graphql`
  query {
    allFile(filter: {relativeDirectory: {eq: "me-page"}}, sort: {fields: id}) {
      edges {
        node {
          childImageSharp {
            id
            fluid(cropFocus: CENTER, maxHeight: 400, maxWidth: 400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
  
`