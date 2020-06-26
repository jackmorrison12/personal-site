import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleArchive from "../components/articles/articlearchive"

const ArticlesPage = () => (
  <Layout>
    <SEO title="Articles" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container-small ">
        <div className="col-xs-12 ">
          <h1 className="title title-borders margin-0-t">Article Archive</h1>
        </div>
        <div className="col-xs-12 col-md-12">
          <ArticleArchive />
        </div>
      </div>
    </div>
  </Layout>
)

export default ArticlesPage
