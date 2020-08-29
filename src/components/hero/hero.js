import React from "react"

import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Socials from "./socials"

export default props => (
  <>
    <div className="is-red-bg">
      <div className="container-small row hero">
        <div className="col-xs-12 text-align-center">
          <h1 className="title margin-0 pad-15-t">
            <Twemoji svg text="Hey 👋 I'm Jack" />{" "}
          </h1>
          <h2 className="subtitle margin-0">
            <br />
            I'm a computing student at{" "}
            <OutboundLink
              className="is-white link"
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
    </div>
    <div class="wave-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220">
        <path
          fill="#f4442e"
          fill-opacity="1"
          d="M0,128L80,117.3C160,107,320,85,480,96C640,107,800,149,960,154.7C1120,160,1280,128,1360,112L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </div>
  </>
)
