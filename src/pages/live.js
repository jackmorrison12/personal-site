import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Banner from "../components/live/banner"
import FortnightView from "../components/live/fortnightview"
import APIDetail from "../components/live/apidetail"
import WhatIs from "../components/live/whatis"
import StaticStats from "../components/live/staticstats"

Date.prototype.formatDDMMYYYY = function () {
  return this.getDate() + "/" + (this.getMonth() + 1)
}

const LivePage = () => {
  const [todaySummary, setTodaySummary] = useState(0)
  const [todaysTweets, setTodaysTweets] = useState(0)
  const [summary, setSummary] = useState([])
  const [selectedAPI, setSelectedAPI] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [displayDetail, setDisplayDetail] = useState(false)
  const [displayFragments, setDisplayFragments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

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
        var tweetSum = 0
        if (result.tweet) {
          tweetSum += result.tweet
        }
        if (result.retweet) {
          tweetSum += result.retweet
        }
        setTodaysTweets(tweetSum)
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

  let click = async (api, date) => {
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
    setCurrentPage(1)
    setSelectedAPI(api)
    setSelectedDate(date)
    setDisplayDetail(true)
    await new Promise(r => setTimeout(r, 20))

    document.getElementById("results").scrollIntoView({
      behavior: "smooth",
    })
  }

  let enter = (e, api, date) => {
    if (e.keyCode === 13) {
      click(api, date)
    }
  }

  return (
    <Layout>
      <SEO title="Live" />
      <div className="is-grey is-light-grey-bg pad-10-t pad-3-lr">
        <div className="row container-small">
          <div className="col-xs-12 col-md-12">
            <h1 className="title title-borders margin-0-t">Today I have...</h1>
          </div>
        </div>
      </div>
      <Banner
        click={click}
        enter={enter}
        todaySummary={todaySummary}
        todaysTweets={todaysTweets}
      />

      <FortnightView click={click} enter={enter} summary={summary} />
      <APIDetail
        displayDetail={displayDetail}
        setDisplayDetail={setDisplayDetail}
        selectedAPI={selectedAPI}
        selectedDate={selectedDate}
        displayFragments={displayFragments}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <StaticStats />
      <WhatIs />
    </Layout>
  )
}

export default LivePage
