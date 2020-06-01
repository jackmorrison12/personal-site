import React from "react"
import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"

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
        Unfortunately, due to Covid-19, I didn't get to go on the annual trip to
        start my AFF course <Twemoji svg text="😪" />
        . However I'm planning to start it this summer, so check back for
        updates!
        <br />
        I'm also the Skydiving Society Secretary for the 2020-21 year.
      </p>
    </div>
    <div className="col-xs-12 col-md-6 text-align-center">
      <p>*Insert photo here of me (eventually) skydiving*</p>
    </div>
  </>
)
