import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero/hero"

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
      <p>Test</p>
    </Layout>
  )
}
