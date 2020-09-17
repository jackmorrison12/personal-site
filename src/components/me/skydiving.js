import React from "react"
import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import SkydivingPic from "./skydiving-pic"

export default () => (
  <>
    <h1 className="col-xs-12">
      <Twemoji svg text="🪂 Skydiving" />
    </h1>
    <div className="col-xs-12 col-md-6">
      <p>
        In 2019, I decided that I wanted to learn how to skydive, so I joined my
        Uni's{" "}
        <OutboundLink
          className="link"
          href="https://www.imperialcollegeunion.org/activities/a-to-z/skydiving"
        >
          Skydiving Society
        </OutboundLink>
        .
        <br />
        I've been completing my AFF course this summer & hope to get my
        A-License soon!
        <br />
        I'm also the Skydiving Society Secretary for the 2020-21 year.
      </p>
    </div>
    <div className="col-xs-12 col-md-6 text-align-center rounded">
      <SkydivingPic />
    </div>
  </>
)
