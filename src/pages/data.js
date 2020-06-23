import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import FileTypes from "../components/stats/file-type-stats"
import GitStats from "../components/stats/git-stats"
import LastFmStats from "../components/stats/last-fm-stats"

import useLastBuildData from "../hooks/use-last-build-data"
import { OutboundLink } from "gatsby-plugin-google-analytics"

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
              loads of APIs I have access to and see what I could create.
            </p>
            <p>
              I continued using APIs as I had from the{" "}
              <OutboundLink
                className="link"
                href="https://v3.jackmorrison.xyz/me"
              >
                previous version of my site
              </OutboundLink>
              , but since I was statically generating my site, I didn't need to
              limit myself to using only APIs. I saw an example on{" "}
              <OutboundLink className="link" href="https://sld.codes/stats">
                sld.codes
              </OutboundLink>{" "}
              where Sam used scripts to generate stats on each site build, and
              decided to try implementing something similar myself.
            </p>
            <p>
              However, I then also wanted to be able to make the stats work in
              real time, rather than just on each build, which is why I am
              currently working on{" "}
              <Link className="link" to="/live">
                a new iteration
              </Link>{" "}
              of this page, which connects to my own NodeJS server to provide
              real-time stats! This is a WIP page that I hope to integrate
              gradually into this page.
            </p>
            <p>
              As of now, this page is generated on every site build, running
              scripts locally using git hooks, and on the build machine using a
              shell script.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DataPage
