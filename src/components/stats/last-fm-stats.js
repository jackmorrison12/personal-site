import React from "react"
import { Twemoji } from "react-emoji-render"
import Img from "gatsby-image"
import TimeAgo from "react-timeago"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import useLastFMData from "../../hooks/use-lastfm-data"

export default props => {
  var data = useLastFMData()
  let topTrack = data.topTrack.topTrack
  let topArtists = data.topArtists.topArtists
  let topAlbums = data.topAlbums.topAlbums
  let albumImages = data.albumImages.nodes
  return (
    <>
      <h2>
        My most listened to song this week is{" "}
        <OutboundLink href={topTrack.url} className="link is-yellow">
          <span className="is-yellow">{topTrack.name}</span>
        </OutboundLink>{" "}
        by{" "}
        <OutboundLink href={topTrack.artistUrl} className="link is-yellow">
          <span className="is-yellow">{topTrack.artist}</span>
        </OutboundLink>
        . I've listened to it{" "}
        <span className="is-yellow">{topTrack.playCount}</span> times!
      </h2>
      <h2>
        This month, I've been listening to a lot of{" "}
        <OutboundLink href={topArtists[0].url} className="link is-yellow">
          <span className="is-yellow">{topArtists[0].name}</span>
        </OutboundLink>{" "}
        and{" "}
        <OutboundLink href={topArtists[1].url} className="link is-yellow">
          <span className="is-yellow">{topArtists[1].name}</span>
        </OutboundLink>
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
            <OutboundLink href={item.url} className="link is-yellow">
              <p className="is-yellow text-align-center margin-0-b">
                {item.name}
              </p>
            </OutboundLink>
            <p className="is-pink text-align-center margin-0-t">
              {item.playCount} plays
            </p>
          </div>
        ))}
      </div>
      <h2>
        Some of my top albums from the last year are by{" "}
        <OutboundLink href={topAlbums[0].url} className="link is-yellow">
          <span className="is-yellow">{topAlbums[0].artist}</span>
        </OutboundLink>{" "}
        and{" "}
        <OutboundLink href={topAlbums[1].url} className="link is-yellow">
          <span className="is-yellow">{topAlbums[1].artist}</span>
        </OutboundLink>
        .
      </h2>
      <div className="row pad-5-t">
        {topAlbums.map((item, i) => (
          <div className="col-xs-6 col-sm-2">
            <OutboundLink href={item.url}>
              <div className="grow rounded">
                <Img fluid={albumImages[i].childImageSharp.fluid} />
              </div>
              <p className="link bold is-yellow text-align-center margin-0-b">
                {item.name}
              </p>
            </OutboundLink>
            <OutboundLink href={item.artistUrl} className="link is-yellow">
              <p className="is-yellow text-align-center margin-0-tb">
                {item.artist}
              </p>
            </OutboundLink>
            <p className="is-pink text-align-center margin-0-t">
              {item.playCount} plays
            </p>
          </div>
        ))}
      </div>
      <p>
        <Twemoji svg text="🎸 Provided by the " />
        <OutboundLink className="link" href="https://www.last.fm/api/intro">
          Last FM API
        </OutboundLink>
        , accurate as of last build (<TimeAgo date={props.last_build} />)
      </p>
    </>
  )
}
