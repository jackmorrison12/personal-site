import React, { useState, useEffect } from "react"

import "@fortawesome/fontawesome-svg-core/styles.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TimeAgo from "react-timeago"

import { SlideDown } from "react-slidedown"
import "react-slidedown/lib/slidedown.css"

import Layout from "../components/layout"
import SEO from "../components/seo"
library.add(fab)

Date.prototype.formatDDMMYYYY = function () {
  return this.getDate() + "/" + (this.getMonth() + 1)
}

const LivePage = () => {
  const [todaySummary, setTodaySummary] = useState(0)
  const [summary, setSummary] = useState([])
  const [selectedAPI, setSelectedAPI] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [displayDetail, setDisplayDetail] = useState(false)
  const [displayFragments, setDisplayFragments] = useState([])

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
        setTodaySummary(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))
    fetch(url + "/getSummariesByDate")
      .then(response => response.json())
      .then(result => {
        setSummary(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))
  }, [])

  function click(api, date) {
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

    var urlencoded = new URLSearchParams()
    urlencoded.append("date", date)
    urlencoded.append("api", api)

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

    fetch(url + "/getAPIFragmentsFromDate", requestOptions)
      .then(response => response.json())
      .then(result => {
        setDisplayFragments(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))
    setDisplayDetail(true)
    setSelectedAPI(api)
    setSelectedDate(date)
  }

  return (
    <Layout>
      <SEO title="Live" />
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <h1 className="col-xs-12 pad-5-b">Today I have...</h1>

          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center"
            onClick={() => click("lastfm", 13)}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                click("lastfm", 13)
              }
            }}
            role="button"
            tabindex="0"
          >
            <FontAwesomeIcon
              icon={["fab", "lastfm"]}
              size="4x"
              className="grow-3 live-icon is-lastfm-red-bg is-white-always"
            />
            <h3>
              Listened to{" "}
              {todaySummary.music ? (
                todaySummary.music > 1 ? (
                  <>
                    <span className="is-red">{todaySummary.music}</span>
                    <span> songs</span>
                  </>
                ) : (
                  <>
                    <span className="is-red">1</span>
                    <span>song</span>
                  </>
                )
              ) : (
                <>
                  <span className="is-red">0</span>
                  <span> songs</span>
                </>
              )}
            </h3>
          </div>
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center"
            onClick={() => click("github", 13)}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                click("github", 13)
              }
            }}
            role="button"
            tabindex="0"
          >
            <FontAwesomeIcon
              icon={["fab", "github"]}
              size="4x"
              className="grow-3 live-icon is-black-bg is-white"
            />
            <h3>
              {todaySummary.git_push ? (
                todaySummary.git_push > 1 ? (
                  <>
                    <span>Pushed code </span>
                    <span className="is-yellow">{todaySummary.git_push}</span>
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
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center"
            onClick={() => click("twitter", 13)}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                click("twitter", 13)
              }
            }}
            role="button"
            tabindex="0"
          >
            <FontAwesomeIcon
              icon={["fab", "twitter"]}
              size="4x"
              className="grow-3 live-icon is-twitter-blue-bg is-white-always"
            />
            <h3>
              {todaySummary.tweet ? (
                todaySummary.tweet > 1 ? (
                  <>
                    <span>Tweeted</span>
                    <span className="is-twitter-blue">
                      {todaySummary.tweet}
                    </span>
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
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center"
            onClick={() => click("googlefit", 13)}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                click("googlefit", 13)
              }
            }}
            role="button"
            tabindex="0"
          >
            <FontAwesomeIcon
              icon={faShoePrints}
              size="4x"
              className="grow-3 live-icon is-pink-bg is-white-always"
            />
            <h3>
              Taken{" "}
              {todaySummary.steps ? (
                todaySummary.steps > 1 ? (
                  <>
                    <span className="is-pink">{todaySummary.steps}</span>
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
      <div className="is-grey is-light-grey-bg  pad-3-lr">
        <div className="row container ">
          <h1 className="col-xs-12 pad-5-b">
            Lets take a look at the last fortnight...
          </h1>
          <div className="row14 container center14-xs">
            {summary
              ? summary
                  .slice(0)
                  .reverse()
                  .map((item, i) => (
                    <div className="col14-xs-3 col14-sm-1">
                      <div className="text-align-center live-date bold">
                        {new Date(
                          Date.now() - 13 * 86400000 + i * 86400000
                        ).formatDDMMYYYY()}
                      </div>
                      {item.lastfm ? (
                        <div
                          className={
                            "live-dot is-lastfm-red-bg-always margin-3-tb grow-3 bold"
                          }
                          onClick={() => click("lastfm", i)}
                          onKeyDown={e => {
                            if (e.keyCode === 13) {
                              click("lastfm", i)
                            }
                          }}
                          role="button"
                          tabindex="0"
                        >
                          {item.lastfm}
                        </div>
                      ) : (
                        <div
                          className={"live-dot is-light-grey-bg margin-3-tb"}
                        ></div>
                      )}
                      {item.github ? (
                        <div
                          className={
                            "live-dot is-yellow-bg-always margin-3-tb grow-3 bold"
                          }
                          onClick={() => click("github", i)}
                          onKeyDown={e => {
                            if (e.keyCode === 13) {
                              click("github", i)
                            }
                          }}
                          role="button"
                          tabindex="0"
                        >
                          {item.github}
                        </div>
                      ) : (
                        <div
                          className={"live-dot is-light-grey-bg margin-3-tb"}
                        ></div>
                      )}
                      {/* {item.twitter ? (
                        <div
                          className={
                            "live-dot is-yellow-bg-always margin-3-tb grow-3 bold"
                          }
                          onClick={() => click("twitter", i)}
                        >
                          {item.twitter}
                        </div>
                      ) : (
                        <div
                          className={"live-dot is-light-grey-bg margin-3-tb"}
                        ></div>
                      )} */}
                    </div>
                  ))
              : ""}
          </div>
        </div>
      </div>
      <SlideDown closed={!displayDetail}>
        <div className="row pad-10-t pad-3-lr container">
          <div className="col-xs-12 col-md-12">
            <div
              role="button"
              tabIndex="0"
              onClick={e => setDisplayDetail(false)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  setDisplayDetail(false)
                }
              }}
              className="link is-medium-blue float-right"
            >
              Close
            </div>
          </div>
        </div>
        <div className="is-grey is-light-grey-bg pad-10-b pad-3-lr">
          <div className="row container ">
            <div className="col-xs-12 ">
              <h1>
                More detail here on {selectedAPI} on{" "}
                {new Date(
                  Date.now() - 13 * 86400000 + selectedDate * 86400000
                ).formatDDMMYYYY()}
              </h1>
              {displayFragments[0]
                ? displayFragments.map(item => (
                    <p>
                      {/* //Change this to show time if more than 1 day ago */}
                      {item.body} - <TimeAgo date={item.occur_date} />
                    </p>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </SlideDown>

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
