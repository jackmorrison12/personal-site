import React from "react"

import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Socials from "./socials"

export default props => (
  <>
    <div className="container-small row hero">
      <div className="col-xs-12 text-align-center">
        <h1 className="title margin-0 pad-15-t">
          <Twemoji svg text="Hey 👋 I'm Jack" />{" "}
        </h1>
        <h2 className="subtitle margin-0">
          <br />
          I'm a computing student at{" "}
          <OutboundLink
            className="is-red link"
            href="https://www.imperial.ac.uk/computing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Imperial
          </OutboundLink>
        </h2>
        <div className="pad-5-t">
          <Socials recents={props.recents} />
        </div>
      </div>
    </div>
  </>
)
