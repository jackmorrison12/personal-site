import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const useLastFMData = () => {
  const data = useStaticQuery(graphql`
    {
      recentTrack: dataJson(recentTrack: { url: { regex: "https://" } }) {
        recentTrack {
          artist
          name
          url
        }
      }
      topTrack: dataJson(topTrack: { url: { regex: "https://" } }) {
        topTrack {
          name
          artist
          playCount
          url
        }
      }
      topAlbums: dataJson(
        topAlbums: { elemMatch: { url: { regex: "https://" } } }
      ) {
        topAlbums {
          name
          imageUrl
          playCount
          url
          artist
          artistUrl
        }
      }
      topArtists: dataJson(
        topArtists: { elemMatch: { url: { regex: "https://" } } }
      ) {
        topArtists {
          name
          playCount
          url
        }
      }
      albumImages: allFile(
        filter: { relativeDirectory: { eq: "lastfm" } }
        sort: { fields: childImageSharp___fluid___originalName }
      ) {
        nodes {
          childImageSharp {
            id
            fluid(maxHeight: 400, maxWidth: 400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  `)
  return data
}

export default useLastFMData
