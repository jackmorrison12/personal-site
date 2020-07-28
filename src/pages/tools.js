import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ToolsPage = () => (
  <Layout>
    <SEO title="Tools" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12 ">
          <h1 className="margin-0-t title title-borders">Tools Used</h1>
          <p>
            The site is created using:
            <ul>
              <li>
                <b className="is-red">GatsbyJS</b>, a static site generator
                based on react
              </li>
              <li>
                <b className="is-red">Custom-built CSS</b>, written by me and
                from{" "}
                <Link className="link" to="/credits">
                  other sources
                </Link>
              </li>
              <li>
                <b className="is-red">Netlify</b>, which is a hosting platform,
                and manages the DNS of the site
              </li>
              <li>
                <b className="is-red">Netlify CMS</b>, which is a content
                management system
              </li>
            </ul>
          </p>
          <h1 className="margin-0-t">Blog Series</h1>
          <p>
            When I initially created the site, I wrote a 6-part series of blog
            posts, entitled{" "}
            <Link className="link" to={"blog/portfolio"}>
              <i>Developing My Ideal Personal Portfolio Website</i>
            </Link>
            <ul>
              <li>
                <Link className="link" to={"blog/portfolio/introduction"}>
                  <b>Part 1 - Introduction</b>
                </Link>
              </li>
              <li>
                <Link className="link" to={"blog/portfolio/tech-stack"}>
                  <b>Part 2 - Choosing my Tech Stack</b>
                </Link>
              </li>
              <li>
                <Link className="link" to={"blog/portfolio/starting-out"}>
                  <b>Part 3 - Where to start?</b>
                </Link>
              </li>
              <li>
                <Link className="link" to={"blog/portfolio/adding-content"}>
                  <b>Part 4 - Adding Content</b>
                </Link>
              </li>
              <li>
                <Link className="link" to={"blog/portfolio/personalisation"}>
                  <b>Part 5 - Personalisation!</b>
                </Link>
              </li>
              <li>
                <Link className="link" to={"blog/portfolio/cv"}>
                  <b>Part 6 - Coding a CV in React</b>
                </Link>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  </Layout>
)

export default ToolsPage
