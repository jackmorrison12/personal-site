import React from "react"

import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Socials from "./socials"
import Wave from "./wave"

export default () => (
  <>
    <div className="hero">
      <div className="container-small row">
        <div className="col-xs-12 text-align-center is-white-always">
          <h1 className="h-title margin-0 pad-15-t">
            <Twemoji svg text="Hey 👋 I'm Jack" />{" "}
          </h1>
          <h2 className="h-subtitle margin-0">
            I'm a Computing Student at{" "}
            <OutboundLink
              className="is-white-always link"
              href="https://www.imperial.ac.uk/computing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Imperial
            </OutboundLink>
          </h2>
          <div className="pad-5-t">
            <Socials showRecents={false} />
          </div>
        </div>
      </div>
    </div>
    <div class="wave-container">
      <Wave />
    </div>
  </>
)
