import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Emoji from 'a11y-react-emoji'


const DataPage = () => (
  <Layout>
    <SEO title="Data" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
            <div className="col-xs-12 ">
                <h1 className="is-title margin-0-t">I <Emoji symbol="💙" label="heart" /> data</h1>
                <div className="line margin-3-t margin-10-b" />
                <p>I also love creating things. I wanted to combine loads of APIs I have access to and see what I could create. </p>
            </div>
        </div>
    </div>
  </Layout>
)

export default DataPage
