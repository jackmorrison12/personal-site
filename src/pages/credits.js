import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import sources from "../data/sources.json"
import { OutboundLink } from "gatsby-plugin-google-analytics"

const CreditsPage = () => (
  <Layout>
    <SEO title="Credits" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1 className="is-title margin-0-t">Credits</h1>
          <p>
            This site would not be possible without the following code &
            tutorials
          </p>
          {sources.map(item => {
            return (
              <>
                <h2 className="margin-1-b">{item.type}</h2>
                <h5 className="margin-0-t">
                  {item.description}
                  {item.shoutout ? (
                    <>
                      <span>, with a significant shoutout to </span>
                      <OutboundLink
                        href={item.shoutout.url}
                        className="is-medium-blue link"
                      >
                        {item.shoutout.name}
                      </OutboundLink>
                    </>
                  ) : (
                    ""
                  )}
                </h5>
                <ul>
                  {item.sources.map(item => {
                    return (
                      <li>
                        {item.name} -
                        {item.links.length === 1 ? (
                          <>
                            {" "}
                            <OutboundLink
                              href={item.links[0]}
                              className="is-medium-blue link"
                            >
                              Source
                            </OutboundLink>
                          </>
                        ) : (
                          item.links
                            .map((link, i, links) => {
                              return (
                                <>
                                  {" "}
                                  <OutboundLink
                                    href={link}
                                    className="is-medium-blue link"
                                  >
                                    Source {i + 1}
                                  </OutboundLink>
                                </>
                              )
                            })
                            .reduce((prev, curr) => [prev, " , ", curr])
                        )}
                      </li>
                    )
                  })}
                </ul>
              </>
            )
          })}
        </div>
      </div>
    </div>
  </Layout>
)

export default CreditsPage
