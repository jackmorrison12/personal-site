import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogRoll from '../components/blog/blogroll'


const BlogPage = () => (
  <Layout>
    <SEO title="Blog" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1 className="is-hero-menu margin-0-t">My Blog</h1>
          <div className="line margin-3-t margin-10-b" />
        </div>
        <div className="col-xs-12 col-md-12">
          <BlogRoll />  
        </div>
      </div>
    </div>
  </Layout>
)

export default BlogPage
