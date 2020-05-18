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
          <h1 className="is-title margin-0">
            I <Emoji symbol="💙" label="heart" /> data
          </h1>
        </div>
      </div>
    </div>
    <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
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
  </Layout>
)

export default DataPage
