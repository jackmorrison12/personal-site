import React from "react"
import { Twemoji } from "react-emoji-render"

import { EducationTimeline } from "./timelines"

export default () => (
  <>
    <h1 className="container col-xs-12 pad-4-t pad-5-l">
      <Twemoji svg text="📚 Education" />
    </h1>
    <EducationTimeline />
  </>
)
