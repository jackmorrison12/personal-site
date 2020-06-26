import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ProjectRoll from "../components/projects/projectroll"

const ProjectsPage = () => (
  <Layout>
    <SEO title="Projects" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container-small ">
        <div className="col-xs-12 ">
          <h1 className="title title-borders margin-0-t">
            Some things I've made
          </h1>
        </div>
        <div className="col-xs-12 col-md-12">
          <ProjectRoll />
        </div>
      </div>
    </div>
  </Layout>
)

export default ProjectsPage
