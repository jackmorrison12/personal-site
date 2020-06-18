import React, { useState, useEffect } from "react"

import "@fortawesome/fontawesome-svg-core/styles.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Layout from "../components/layout"
import SEO from "../components/seo"
library.add(fab)

const LivePage = () => {
  const [summary, setSummary] = useState(0)
  useEffect(() => {
    const d = new Date()
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d)
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)

    var date = `${ye}-${mo}-${da}`

    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

    var urlencoded = new URLSearchParams()
    urlencoded.append("date", date)

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    }
    var url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://api.jackmorrison.xyz"

    fetch(url + "/getSummaryForDate", requestOptions)
      .then(response => response.json())
      .then(result => {
        setSummary(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))
  }, [])
  return (
    <Layout>
      <SEO title="Live" />
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <h1 className="col-xs-12 pad-5-b">Today I have...</h1>

          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={["fab", "lastfm"]}
              size="4x"
              className="grow-5 live-icon is-lastfm-red-bg is-white-always"
            />
            <h3>
              Listened to{" "}
              {summary.music ? (
                summary.music > 1 ? (
                  <>
                    <span className="is-red">{summary.music}</span>
                    <span> songs</span>
                  </>
                ) : (
                  <>
                    <span className="is-red">1</span>
                    <span>song</span>
                  </>
                )
              ) : (
                "0 songs"
              )}
            </h3>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={["fab", "github"]}
              size="4x"
              className="grow-5 live-icon is-black-bg is-white"
            />
            <h3>
              {summary.git_push ? (
                summary.git_push > 1 ? (
                  <>
                    <span>Pushed code </span>
                    <span className="is-yellow">{summary.git_push}</span>
                    <span> times</span>
                  </>
                ) : (
                  <>
                    <span>Pushed code </span>
                    <span className="is-yellow">once</span>
                  </>
                )
              ) : (
                <>
                  <span>Not pushed </span>
                  <span className="is-yellow">any code</span>
                  <span>... yet</span>
                </>
              )}
            </h3>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={["fab", "twitter"]}
              size="4x"
              className="grow-5 live-icon is-twitter-blue-bg is-white-always"
            />
            <h3>
              {summary.tweet ? (
                summary.tweet > 1 ? (
                  <>
                    <span>Tweeted</span>
                    <span className="is-twitter-blue">{summary.tweet}</span>
                    <span> times</span>
                  </>
                ) : (
                  <>
                    <span>Tweeted </span>
                    <span className="is-twitter-blue">once</span>
                  </>
                )
              ) : (
                <>
                  <span>Not tweeted </span>
                  <span className="is-twitter-blue">anything</span>
                  <span>... yet</span>
                </>
              )}
            </h3>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={faShoePrints}
              size="4x"
              className="grow-5 live-icon is-pink-bg is-white-always"
            />
            <h3>
              Taken{" "}
              {summary.steps ? (
                summary.steps > 1 ? (
                  <>
                    <span className="is-pink">{summary.steps}</span>
                    <span>step</span>
                  </>
                ) : (
                  <>
                    <span className="is-pink">1</span>
                    <span>step</span>
                  </>
                )
              ) : (
                <>
                  <span className="is-pink">no</span>
                  <span> steps... yet</span>
                </>
              )}
            </h3>
          </div>
        </div>
      </div>
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1>What is this page?</h1>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LivePage
