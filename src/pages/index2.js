import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero/hero"
import Socials from "../components/hero/socials"
import ProjectPreviews from "../components/projects/projectpreviewsv2"
import WritingPreviews from "../components/writing/writingpreviews"

export default () => (
  <Layout>
    <SEO title="Home" />
    <Hero />
    <div className="row container-small">
      <div className="col-xs-12 text-align-center">
        <h2>Here's some stuff I've been working on...</h2>
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
