import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogRoll from '../components/blog/blogroll'


const BlogPage = () => (
  <Layout>
    <SEO title="Blog" />
    <BlogRoll />
  </Layout>
)

export default BlogPage
