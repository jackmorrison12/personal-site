import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero/hero"

export default () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Hero />
    </Layout>
  )
}
