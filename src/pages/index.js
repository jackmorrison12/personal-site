import React from "react"
import { Link } from "gatsby"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import Img from "gatsby-image"
import { Twemoji } from "react-emoji-render"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticlePreviews from "../components/articles/articlepreviews"
import BlogPreviews from "../components/blog/blogpreviews"
import ProjectPreviews from "../components/projects/projectpreviews"

import socials from "../data/socials.json"
library.add(fab)

export default () => {
  return (
    <Layout>
      <SEO title="Home" />
      <div className=" is-black diagonal-box">
        <div className="row container-small pad-10-t">
          <div className="col-xs-12 pad-5-lr">
            <div className="">
              <h1 className="me-hero-title title margin-0-t">
                <Twemoji svg text="Hey 👋 I'm Jack" />
                <br />
                I'm a computing student at{" "}
                <OutboundLink
                  className="is-red link"
                  href="https://www.imperial.ac.uk/computing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Imperial
                </OutboundLink>
              </h1>
              <h3>
                Feel free to take a look around and discover some things I've
                been working on!
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="is-red-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12">
            <h2>Projects I've been working on</h2>
            <ProjectPreviews />
          </div>
        </div>
      </div>
      <div className="is-light-grey-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12">
            <h2>My Latest Articles</h2>
            <ArticlePreviews />
          </div>
        </div>
      </div>
      <div className="is-red-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12">
            <h2>My Latest Blog Posts</h2>
            <BlogPreviews />
          </div>
        </div>
      </div>
      <div className="is-light-grey-bg is-black ">
        <div className="row container-small pad-20-t pad-3-lr pad-10-b ">
          <div className="col-xs-12">
            <h2 className="text-align-center">Where else can you reach me?</h2>
            <div className="text-align-center">
              {socials
                .filter(item => item.home)
                .map(item => (
                  <OutboundLink
                    href={item.url}
                    className="is-black pad-2 col-xs-3"
                  >
                    <FontAwesomeIcon
                      icon={["fab", item.icon]}
                      size="2x"
                      className="grow-5"
                    />
                  </OutboundLink>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
