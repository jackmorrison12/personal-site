import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

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
        ? "localhost:8080"
        : "jackmorrison.xyz"

    fetch("https://" + url + "/getAPISummaryForDate", requestOptions)
      .then(response => response.json())
      .then(result => {
        setSummary(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))

    //     fetch("https://" + url + "/getSummaryForDate", {
    //       method: "POST",
    //       mode: "cors",
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //       body: "date=" + date.toString(),
    //     })
    //       //   .then(response => response.json()) // parse JSON from request
    //       .then(resultData => {
    //         setSummary(resultData)
    //         console.log(resultData)
    //       })
  }, [])
  return (
    <Layout>
      <SEO title="Live" />
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          {summary.lastfm ? (
            <div className="col-xs-12 col-sm-6 ">
              I've listened to {summary.lastfm} songs
            </div>
          ) : (
            ""
          )}
          {summary.github ? (
            <div className="col-xs-12 col-sm-6 ">
              I've done {summary.github} events
            </div>
          ) : (
            ""
          )}
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
