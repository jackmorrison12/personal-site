import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="container pad-20-t ">
        <h1 className="is-primary">This page doesn't exist... yet!</h1>
        <h3>
          Why not{" "}
          <Link to="/writing" className="link ">
            read an article
          </Link>
          , or{" "}
          <Link to="/data" className="link">
            look at what I've been up to recently
          </Link>
          ?
        </h3>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage
