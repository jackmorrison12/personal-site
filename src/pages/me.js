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
      <div className="row ">
          {data.allImageSharp.edges.map(edge => 
            <div className="col-xs-4 col-sm-2 pad-0">
              <Img style={{opacity: 0.2}} fluid={edge.node.fluid} />
            </div>
          )}     
      </div>
      
    </div>
  </Layout>
)

export const query = graphql`
  query {
    allImageSharp {
      edges {
        node {
          id
          fluid(maxWidth: 400, maxHeight: 400, cropFocus: CENTER) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`