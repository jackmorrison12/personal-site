import React from "react"

import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import Logo from "./logo"

export default () => (
  <>
    <div className="row half-height">
      <div className="col-xs-12 col-md-6 text-align-center">
        <h1 className="hero-title">
          <Twemoji svg text="Hey 👋 I'm Jack" />{" "}
        </h1>
        <h2>
          <br />A computing student at{" "}
          <OutboundLink
            className="is-red link"
            href="https://www.imperial.ac.uk/computing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Imperial
          </OutboundLink>
        </h2>
        <Logo />
      </div>
      <div className="col-xs-12 col-md-6 is-red-bg is-white">Articles</div>
    </div>
    <div className="row half-height">
      <div className="col-xs-12 col-md-6 is-red-bg is-white">Socials</div>
      <div className="col-xs-12 col-md-6">Projects</div>
    </div>
  </>
)
