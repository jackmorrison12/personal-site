import React from "react"
import Emoji from "a11y-react-emoji"

export default () => {
  return (
    <>
      <h2>
        My most listened to song this week is{" "}
        <span className="is-red">Dont Worry Bout Me</span> by{" "}
        <span className="is-red">Zara Larsson</span>.
      </h2>
      <h2>
        I've listened to it <span className="is-red">27</span> times this week,{" "}
        <span className="is-red">23</span> times this month and{" "}
        <span className="is-red">170</span> times since tracking began.
      </h2>
      <p>
        <Emoji symbol="🎸" label="guitar" /> Provided by the Last FM API
      </p>
    </>
  )
}
