import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const CreditsPage = () => (
  <Layout>
    <SEO title="Credits" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
            <div className="col-xs-12 ">
                <h1 className="is-hero-menu margin-0-t">Credits</h1>
                <p>This site would not be possible without the following code & tutorials</p>
                <h2>Framework</h2>
                    <ul>
                        <li>Gatsby Tutorial - <a href="https://www.gatsbyjs.org/tutorial/" className="is-medium-blue btn">Source</a></li>
                    </ul>
                <h2>Styling</h2>
                    <ul>
                        <li>Design Inspiration - <a href="https://sld.codes" className="is-medium-blue btn">Source</a></li>
                        <li>CSS Skeletons - <a href="https://github.com/slarsendisney/personal-site/tree/master/src/styles" className="is-medium-blue btn">Source</a></li>
                        <li>Dark Mode Support - <a href="https://sld.codes/articles/How-I-Added-Dark-Mode-In-20-Lines" className="is-medium-blue btn">Source</a></li>
                    </ul>
                <h2>Hosting</h2>
                    <ul>
                        <li>Netlify Tutorial - <a href="https://www.netlify.com/blog/2016/02/24/a-step-by-step-guide-gatsby-on-netlify/" className="is-medium-blue btn">Source</a></li>
                    </ul>
                <h2>CMS</h2>
            </div>
        </div>
    </div>
    <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
        <div className="row container ">
            <div className="col-xs-12 ">
                <h1 className="is-hero-menu margin-0-t">Site Structure</h1>
                <div className="line margin-3-t margin-10-b" />
            </div>
        </div>
    </div>
  </Layout>
)

export default CreditsPage
