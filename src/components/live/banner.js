import React from "react"

import "@fortawesome/fontawesome-svg-core/styles.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faShoePrints } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
library.add(fab)

export default props => {
  return (
    <>
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <h1 className="col-xs-12 pad-5-b">Today I have...</h1>

          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={["fab", "lastfm"]}
              size="4x"
              className="grow-3 live-icon is-lastfm-red-bg is-white-always pointer"
              onClick={() => props.click("lastfm", 13)}
              onKeyDown={e => {
                props.enter(e, "lastfm", 13)
              }}
              role="button"
              tabindex="0"
            />
            <h3>
              Listened to{" "}
              {props.todaySummary.music ? (
                props.todaySummary.music > 1 ? (
                  <>
                    <span className="is-red">{props.todaySummary.music}</span>
                    <span> songs</span>
                  </>
                ) : (
                  <>
                    <span className="is-red">1</span>
                    <span> song</span>
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
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={["fab", "github"]}
              size="4x"
              className="grow-3 live-icon is-black-bg is-white pointer"
              onClick={() => props.click("github", 13)}
              onKeyDown={e => {
                props.enter(e, "github", 13)
              }}
              role="button"
              tabindex="0"
            />
            <h3>
              {props.todaySummary.git_push ? (
                props.todaySummary.git_push > 1 ? (
                  <>
                    <span>Pushed code </span>
                    <span className="is-yellow">
                      {props.todaySummary.git_push}
                    </span>
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
              className="grow-3 live-icon is-twitter-blue-bg is-white-always pointer"
              onClick={() => props.click("twitter", 13)}
              onKeyDown={e => {
                props.enter(e, "twitter", 13)
              }}
              role="button"
              tabindex="0"
            />
            <h3>
              {props.todaysTweets > 0 ? (
                props.todaysTweets > 1 ? (
                  <>
                    <span>Tweeted </span>
                    <span className="is-twitter-blue">
                      {props.todaysTweets}
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
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 text-align-center">
            <FontAwesomeIcon
              icon={faShoePrints}
              size="4x"
              className="grow-3 live-icon is-pink-bg is-white-always pointer"
              onClick={() => props.click("googlefit", 13)}
              onKeyDown={e => {
                props.enter(e, "googlefit", 13)
              }}
              role="button"
              tabindex="0"
            />
            <h3>
              Taken{" "}
              {props.todaySummary.steps ? (
                props.todaySummary.steps > 1 ? (
                  <>
                    <span className="is-pink">{props.todaySummary.steps}</span>
                    <span> steps</span>
                  </>
                ) : (
                  <>
                    <span className="is-pink">1</span>
                    <span> step</span>
                  </>
                )
              ) : (
                <>
                  <span className="is-pink">no</span>
                  <span> steps... yet</span>
                  <sup style={{ fontSize: "0.5em" }}> BETA</sup>
                </>
              )}
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}
