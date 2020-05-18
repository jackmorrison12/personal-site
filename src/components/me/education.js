import React from "react"
import Emoji from "a11y-react-emoji"

import { EducationTimeline } from "./timelines"

export default () => (
  <>
    <h1 className="container col-xs-12 pad-4-t pad-5-l">
      <Emoji symbol="📚" label="books" /> Education
    </h1>
    <EducationTimeline />
  </>
)
