import React from "react"
import { Twemoji } from "react-emoji-render"

export default props => {
  return (
    <>
      <div className="is-grey is-light-grey-bg pad-5-b pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1>
              <Twemoji svg text="🤔 What is this page? " />
            </h1>
            <p>
              I have data scattered all over the internet. I wanted all of that
              in one place. This is the result!
            </p>
            <p>
              This page is currently a work in progress... check back for
              updates!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
