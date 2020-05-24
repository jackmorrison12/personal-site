import React from "react"
import Emoji from "a11y-react-emoji"
import Img from "gatsby-image"

import useLastFMData from "../../hooks/use-lastfm-data"

export default () => {
  var data = useLastFMData()
  let topTrack = data.topTrack.topTrack
  let topArtists = data.topArtists.topArtists
  let topAlbums = data.topAlbums.topAlbums
  let albumImages = data.albumImages.edges
  return (
    <>
      <h2>
        My most listened to song this week is{" "}
        <a href={topTrack.url} className="link is-yellow">
          <span className="is-yellow">{topTrack.name}</span>
        </a>{" "}
        by <span className="is-yellow">{topTrack.artist}</span>. I've listened
        to it <span className="is-yellow">{topTrack.playCount}</span> times!
      </h2>
      <h2>
        This month, I've been listening to a lot of{" "}
        <a href={topArtists[0].url} className="link is-yellow">
          <span className="is-yellow">{topArtists[0].name}</span>
        </a>{" "}
        and{" "}
        <a href={topArtists[1].url} className="link is-yellow">
          <span className="is-yellow">{topArtists[1].name}</span>
        </a>
        .
      </h2>
      <div className="row pad-5-t">
        {topArtists.map(item => (
          <div className="col-xs-4 col-sm-2">
            <div className="bar-vertical is-white-bg">
              <section
                className="is-yellow-bg"
                style={{
                  height:
                    (item.playCount / topArtists[0].playCount) * 100 + "%",
                }}
              ></section>
            </div>
            <a href={item.url} className="link is-yellow">
              <p className="is-yellow text-align-center margin-0-b">
                {item.name}
              </p>
            </a>
            <p className="is-pink text-align-center margin-0-t">
              {item.playCount} plays
            </p>
          </div>
        ))}
      </div>
      <h2>
        I'd also have to recommend these albums by{" "}
        <a href={topAlbums[0].url} className="link is-yellow">
          <span className="is-yellow">{topAlbums[0].artist}</span>
        </a>
        ,{" "}
        <a href={topAlbums[1].url} className="link is-yellow">
          <span className="is-yellow">{topAlbums[1].artist}</span>
        </a>{" "}
        and more this month.
      </h2>
      <div className="row pad-5-t">
        {topAlbums.map((item, i) => (
          <div className="col-xs-6 col-sm-2">
            <a href={item.url}>
              <div className="grow">
                <Img fluid={albumImages[i].node.childImageSharp.fluid} />
              </div>
              <p className="link bold is-yellow text-align-center margin-0-b">
                {item.name}
              </p>
            </a>
            <a href={item.artistUrl} className="link is-yellow">
              <p className="is-yellow text-align-center margin-0-tb">
                {item.artist}
              </p>
            </a>
            <p className="is-pink text-align-center margin-0-t">
              {item.playCount} plays
            </p>
          </div>
        ))}
      </div>
      <p>
        <Emoji symbol="🎸" label="guitar" /> Provided by the{" "}
        <a className="link" href="https://www.last.fm/api/intro">
          Last FM API
        </a>
        , accurate as of last build
      </p>
    </>
  )
}
