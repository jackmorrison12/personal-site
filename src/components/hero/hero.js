import React from "react"

import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Socials from "./socials"

export default props => (
  <>
    <div className="hero">
      <div className="container-small row">
        <div className="col-xs-12 text-align-center is-white-always">
          <h1 className="h-title margin-0 pad-15-t">
            <Twemoji svg text="Hey 👋 I'm Jack" />{" "}
          </h1>
          <h2 className="h-subtitle margin-0">
            <br />
            I'm a computing student at{" "}
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
            <Socials recents={props.recents} showRecents={false} />
          </div>
        </div>
      </div>
    </div>
    <div class="wave-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
        <defs>
          <linearGradient id="g1">
            <stop stop-color="#833ab4" />
            <stop offset="1" stop-color="#fd1d1d" />
          </linearGradient>
        </defs>
        <path
          fill="url(#g1)"
          d="M0,128L80,117.3C160,107,320,85,480,96C640,107,800,149,960,154.7C1120,160,1280,128,1360,112L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </div>
  </>
)
