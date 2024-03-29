import React from "react"

import { trackCustomEvent } from "gatsby-plugin-google-analytics"

export default props => {
  return (
    <>
      <div className="is-grey is-light-grey-bg pad-3-lr pad-5-b">
        <div className="row container ">
          <h1 className="col-xs-12 pad-5-b">
            Lets take a look at the last fortnight...
          </h1>
          <div className="row14 container center14-xs">
            {props.summary
              ? props.summary
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
                            "live-dot is-lastfm-red-bg-always margin-3-tb grow-3 bold pointer"
                          }
                          onClick={() => {
                            props.click("lastfm", i)
                            trackCustomEvent({
                              category: "Live Page Fortnight Link",
                              action: "click",
                              label:
                                "LastFM " +
                                new Date(
                                  Date.now() - 13 * 86400000 + i * 86400000
                                ).formatDDMMYYYY(),
                            })
                          }}
                          onKeyDown={e => {
                            props.enter(e, "lastfm", i)
                            trackCustomEvent({
                              category: "Live Page Fortnight Link",
                              action: "click",
                              label:
                                "LastFM " +
                                new Date(
                                  Date.now() - 13 * 86400000 + i * 86400000
                                ).formatDDMMYYYY(),
                            })
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
                            "live-dot is-yellow-bg-always margin-3-tb grow-3 bold pointer"
                          }
                          onClick={() => {
                            props.click("github", i)
                            trackCustomEvent({
                              category: "Live Page Fortnight Link",
                              action: "click",
                              label:
                                "GitHub " +
                                new Date(
                                  Date.now() - 13 * 86400000 + i * 86400000
                                ).formatDDMMYYYY(),
                            })
                          }}
                          onKeyDown={e => {
                            props.enter(e, "github", i)
                            trackCustomEvent({
                              category: "Live Page Fortnight Link",
                              action: "click",
                              label:
                                "GitHub " +
                                new Date(
                                  Date.now() - 13 * 86400000 + i * 86400000
                                ).formatDDMMYYYY(),
                            })
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
                      {item.twitter ? (
                        <div
                          className={
                            "live-dot is-twitter-blue-bg-always margin-3-tb grow-3 bold pointer"
                          }
                          onClick={() => {
                            props.click("twitter", i)
                            trackCustomEvent({
                              category: "Live Page Fortnight Link",
                              action: "click",
                              label:
                                "Twitter " +
                                new Date(
                                  Date.now() - 13 * 86400000 + i * 86400000
                                ).formatDDMMYYYY(),
                            })
                          }}
                          onKeyDown={e => {
                            props.enter(e, "twitter", i)
                            trackCustomEvent({
                              category: "Live Page Fortnight Link",
                              action: "click",
                              label:
                                "Twitter " +
                                new Date(
                                  Date.now() - 13 * 86400000 + i * 86400000
                                ).formatDDMMYYYY(),
                            })
                          }}
                          role="button"
                          tabindex="0"
                        >
                          {item.twitter}
                        </div>
                      ) : (
                        <div
                          className={"live-dot is-light-grey-bg margin-3-tb"}
                        ></div>
                      )}
                    </div>
                  ))
              : ""}
          </div>
        </div>
      </div>
    </>
  )
}
