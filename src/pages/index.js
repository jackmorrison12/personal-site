import React, { useState, useEffect } from "react"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { Twemoji } from "react-emoji-render"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ProjectPreviews from "../components/projects/projectpreviewsv2"
import WritingPreviews from "../components/writing/writingpreviews"

import socials from "../data/socials.json"
library.add(fab)

export default () => {
  const [recents, setRecents] = useState([])

  useEffect(() => {
    var url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://api.jackmorrison.xyz"

    fetch(url + "/getRecents")
      .then(response => response.json())
      .then(result => {
        setRecents(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      <div className=" is-black diagonal-box">
        <div className="row container-small pad-10-t">
          <div className="col-xs-12 pad-5-lr">
            <div className="">
              <h1 className="hero-title">
                <Twemoji svg text="Hey 👋 I'm Jack" />
                <br />A computing student at{" "}
                <OutboundLink
                  className="is-red link"
                  href="https://www.imperial.ac.uk/computing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Imperial
                </OutboundLink>
              </h1>
              <h3>
                Take a look around and discover some things I've been working
                on!
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="is-red-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12 col-md-6">
            <Link to="/projects" className="link is-black text-align-center">
              <h2>Projects</h2>
            </Link>
            <ProjectPreviews />
          </div>
          <div className="col-xs-12 col-md-6">
            <Link to="/writing" className="link is-black text-align-center">
              <h2>Writing</h2>
            </Link>
            <WritingPreviews />
          </div>
        </div>
      </div>
      <div className="is-light-grey-bg is-black ">
        <div className="row container-small pad-20-t pad-3-lr pad-10-b ">
          <div className="col-xs-12">
            <h2 className="text-align-center margin-0-b">
              Where else can you reach me?
            </h2>
            <p className="text-align-center margin-0-t">
              The pulsing icons have had recent activity!
            </p>
            <div className="text-align-center row content-center">
              {socials
                .filter(item => item.home)
                .map(item => (
                  <OutboundLink
                    href={item.url}
                    className="is-black pad-2 col-xs-4 col-sm-1"
                  >
                    {recents[item.identifier] ? (
                      //Make flaming
                      <FontAwesomeIcon
                        icon={["fab", item.icon]}
                        size="2x"
                        className={
                          "grow-5 flame " + item.identifier + "-colour"
                        }
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={["fab", item.icon]}
                        size="2x"
                        className={
                          "grow-5  " + item.identifier + "-colour-hover"
                        }
                      />
                    )}
                  </OutboundLink>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
