import React from "react"
import { Twemoji } from "react-emoji-render"
import ReactAudioPlayer from "react-audio-player"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import musicData from "../../data/music.json"

export default () => (
  <>
    <h1 className="col-xs-12">
      <Twemoji svg text="🎸 Making Music" />
    </h1>
    <div className="col-xs-12 col-md-6">
      <p>
        I've always loved listening to music, and in 2019 I decided I wanted to
        learn how to make it too. I took a course called{" "}
        <OutboundLink
          className="link"
          href="https://www.imperial.ac.uk/horizons/module-options/2nd-year-undergraduates/music-technology/"
        >
          Music Technology
        </OutboundLink>
        .
        <br />
        We covered many topics, starting off with the basics of how to use a
        Digital Audio Workstation, such as creating sounds using software
        instruments and MIDI keyboards. We then moved on to learn things like
        mixing and using inserts and sends.
        <br />
        We used Cubase in class, however due to coronavirus, I had to teach
        myself how to use Logic Pro X in order to be able to create and submit
        my work.
        <br />
        For the course assessment, we had to create two compositions. You can
        find both of mine on this page, as well as some other things I created
        along the way!
      </p>
    </div>
    <div className="col-xs-12 col-md-6 text-align-center">
      {musicData.map((vid, i) => {
        return (
          <div className="text-align-right">
            <h4>{vid.name}</h4>
            <ReactAudioPlayer
              src={vid.filename}
              className="width-full"
              controls
            />
          </div>
        )
      })}
    </div>
  </>
)
