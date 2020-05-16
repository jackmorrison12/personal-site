import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import CV from "../components/cv/cv"

const CVPage = () => (
  <Layout>
    <SEO title="CV" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
            <div className="col-xs-12 ">
                <h1 className="is-hero-menu margin-0-t">CV</h1>
                <CV />
            </div>
        </div>  
      </div>
  </Layout>
)


export default CVPage
