import React, { useState } from "react"
import { Link } from "gatsby"

import { Twemoji } from "react-emoji-render"

export default props => {
  return (
    <>
      <div className="is-grey is-light-grey-bg pad-3-lr">
        <div className="row container ">
          <h1 className="col-xs-12 pad-0-b margin-0-b">
            <Twemoji svg text="📊 Some more detailed stats... " />
          </h1>
          <p className="col-xs-12 margin-0-t s pad-0-t">
            ... which are generated on each site build, are available on the{" "}
            <Link to="/data" className="link">
              data page
            </Link>
            !
          </p>
        </div>
      </div>
    </>
  )
}
