import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Emoji from "a11y-react-emoji"

const DataPage = () => (
  <Layout>
    <SEO title="Data" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1>What is this page?</h1>
          <p>
            I love creating things. I wanted to combine loads of APIs I have
            access to, and see what I could create.{" "}
          </p>
          <p>This page is generated on every site build</p>
        </div>
      </div>
    </div>
    <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h2>
            My most listened to song this week is{" "}
            <span className="is-red">Ruin My Life</span> by{" "}
            <span className="is-red">Zara Larsson</span>.
          </h2>
          <h2>
            I've listened to it <span className="is-red">17</span> times this
            week, <span className="is-red">23</span> times this month and{" "}
            <span className="is-red">170</span> times since tracking began.
          </h2>
          <p>
            <Emoji symbol="🎸" label="guitar" /> Provided by the Last FM API
          </p>
        </div>
      </div>
    </div>
  </Layout>
)

export default DataPage
