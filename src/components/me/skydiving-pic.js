import React from "react"

import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

export default function SkydivingImage() {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "skydiving/skydiving-1.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 1000) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return <Img fluid={data.file.childImageSharp.fluid} />
}
