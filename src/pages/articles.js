import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleRoll from '../components/articles/articleroll'


const ArticlesPage = () => (
  <Layout>
    <SEO title="Articles" />
    <ArticleRoll />
  </Layout>
)

export default ArticlesPage
