import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import sources from "../data/sources.json"

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
                      <a
                        href={item.shoutout.url}
                        className="is-medium-blue link"
                      >
                        {item.shoutout.name}
                      </a>
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
                            <a
                              href={item.links[0]}
                              className="is-medium-blue link"
                            >
                              Source
                            </a>
                          </>
                        ) : (
                          item.links
                            .map((link, i, links) => {
                              return (
                                <>
                                  {" "}
                                  <a
                                    href={link}
                                    className="is-medium-blue link"
                                  >
                                    Source {i + 1}
                                  </a>
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
    <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1 className="is-title margin-0-t">Site Structure</h1>
          <p>
            As you can see from above, the site is created using GatsbyJS, a
            site generator based on react. It uses custom-built CSS from many
            sources listed above, is hosted using Netlify, and the content is
            manages using Netlify CMS.
          </p>
        </div>
      </div>
    </div>
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1 className="is-title margin-0-t">Can I use it?</h1>
          <p>
            Of course! This site is completely open source. All code is
            available in a git repository, which includes instructions on how to
            set up and deploy the site. All you have to do is put a link back to
            this site (this page in particular) so that everyone who I have
            sourced from also has credit!
          </p>
        </div>
      </div>
    </div>
  </Layout>
)

export default CreditsPage
