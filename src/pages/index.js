import React from "react"
import { Link } from "gatsby"

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import ArticlePreviews from "../components/articles/articlepreviews"
import BlogPreviews from "../components/blog/blogpreviews"

import socials from "../data/socials.json"
library.add(fab);

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className=" is-light-grey-bg is-black">
      <div className="row container-small pad-20-t pad-10-b">
        <div className="col-xs-12 col-sm-6 pad-5-lr">
          <h1 className="is-hero-menu margin-0">Jack Morrison</h1>
          <h3 className="is-hero-sub-text">Computing Student @ <a className="is-red" href="https://www.imperial.ac.uk/computing" target="_blank">Imperial</a></h3>
          <div className="line margin-10-t margin-10-b" />
          <div className="">
            {socials
            .filter((item) => item.home)
            .map((item) => (
              <a href={item.url} className="is-black pad-2 col-xs-3">
                <FontAwesomeIcon icon={['fab', item.icon]} size="2x" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="is-red-bg is-black diagonal-box">
      <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
        <div className="col-xs-12">
          <h2>Projects I've been working on</h2>
        </div>
      </div>
    </div>
    <div className="is-light-grey-bg is-black diagonal-box">
      <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
        <div className="col-xs-12">
          <h2>My Latest Blog Posts</h2>
          <BlogPreviews/>
        </div>
      </div>
    </div>
    <div className="is-red-bg is-black diagonal-box">
      <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
        <div className="col-xs-12">
          <h2>My Latest Articles</h2>
          <ArticlePreviews />
        </div>
      </div>
    </div>
    <div className="is-light-grey-bg is-black diagonal-box">
      <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
        <div className="col-xs-12">
          <h2>Want to know more?</h2>
        </div>
      </div>
    </div>

    <div className="margin-20-b"></div>
  </Layout>
)

export default IndexPage
