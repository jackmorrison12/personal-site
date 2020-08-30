import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero/hero"
import Socials from "../components/hero/socials"

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
      <div className="row container-small text-align-center">
        <div className="col-xs-12">
          <h2>Here's some stuff I've been getting up to...</h2>
        </div>

        <div className="col-xs-12 col-md-6">
          <h2>Projects</h2>
        </div>
        <div className="col-xs-12 col-md-6">
          <h2>Articles</h2>
        </div>
        <div className="pad-5-t col-xs-12">
          <Socials recents={recents} showRecents={true} />
        </div>
      </div>
    </Layout>
  )
}
