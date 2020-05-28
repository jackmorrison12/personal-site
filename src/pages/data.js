import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import FileTypes from "../components/stats/file-type-stats"
import GitStats from "../components/stats/git-stats"
import LastFmStats from "../components/stats/last-fm-stats"

import useLastBuildData from "../hooks/use-last-build-data"

const DataPage = () => {
  var last_build_time = useLastBuildData()

  return (
    <Layout>
      <SEO title="Data" />
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <FileTypes last_build={last_build_time} />
          </div>
        </div>
      </div>
      <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <GitStats last_build={last_build_time} />
          </div>
        </div>
      </div>
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <LastFmStats last_build={last_build_time} />
          </div>
        </div>
      </div>
      <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12">
            <h2>More data sources to be added soon!</h2>
          </div>
        </div>
      </div>
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1>What is this page?</h1>
            <p>
              I love data, and I also love creating things. I wanted to combine
              loads of APIs I have access to and see what I could create.{" "}
            </p>
            <p>
              This page is generated on every site build, running scripts
              locally using git hooks, and on the build machine using a shell
              script.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DataPage
