import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero/hero"
import Socials from "../components/hero/socials"
import ProjectPreviews from "../components/projects/projectpreviewsv2"
import WritingPreviews from "../components/writing/writingpreviews"

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
      <Hero recents={recents} />
      <div className="row container-small">
        <div className="col-xs-12 text-align-center">
          <h2>Here's some stuff I've been getting up to...</h2>
        </div>

        <div className="col-xs-12 col-md-6">
          <h2 className="text-align-center">Projects</h2>
          <ProjectPreviews />
        </div>
        <div className="col-xs-12 col-md-6">
          <h2 className="text-align-center">Articles</h2>
          <WritingPreviews />
        </div>
      </div>
    </Layout>
  )
}
