import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { Twemoji } from "react-emoji-render"

const FairUsePage = () => (
  <>
    <Layout>
      <SEO title="Fair Use Policy" />
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1 className="margin-0-t">
              <Twemoji svg text="🧐 " />
              Can I use this template?
            </h1>
            <p>Of course! This site is completely open source</p>
            <p>
              All code is available in a git repository, which includes
              instructions on how to set up and deploy the site
            </p>
            <p>
              All you have to do is put a link back to this site (
              <Link className="link" to="/credits">
                this page in particular
              </Link>
              ) so that everyone who I have sourced from also has credit!
            </p>
          </div>
        </div>
      </div>
      <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12">
            <h1 className="margin-0-t">
              <Twemoji svg text="⌨️ " />
              Where to find the code
            </h1>
          </div>
          <div className="col-xs-12 col-sm-6 ">
            <p>This site is hosted in a GitHub repository</p>
            <p>
              Netlify tracks this repository and updated the live site whenever
              changes are made
            </p>
          </div>
          <div className="col-xs-12 col-sm-6">
            <object
              type="image/svg+xml"
              data="https://gh-card.dev/repos/jackmorrison12/personal-site.svg?fullname=&link_target=_blank"
            ></object>
          </div>
        </div>
      </div>
      <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
        <div className="row container ">
          <div className="col-xs-12 ">
            <h1 className="margin-0-t">
              <Twemoji svg text="👨‍💻 " />
              How to use the repo
            </h1>
            <ul>
              <li>
                <h2>Clone the repo</h2>
                <p>
                  If you want to use some of the git hooks I've set up (to
                  automatically generate site stats), run the following:
                </p>
                <pre>
                  <code>shell npm run repo-init</code>
                </pre>
              </li>
              <li>
                <h2>Install Gatsby CLI</h2>
                <p>Install the Gatsby CLI globally</p>
                <pre>
                  <code>shell npm install -g gatsby-cli </code>
                </pre>
              </li>
              <li>
                <h2>Start developing</h2>
                <p>Navigate into your new site’s directory and start it up.</p>
                <pre>
                  <code>
                    cd personal-site/ <br />
                    gatsby develop
                  </code>
                </pre>
              </li>
              <li>
                <h2>Open the source code and start editing!</h2>
                <p>
                  Your site is now running at{" "}
                  <code>http://localhost:8000!</code>
                </p>
                <p>
                  Note: You'll also see a second link:
                  <code>http://localhost:8000/___graphql</code>. This is a tool
                  you can use to experiment with querying your data. Learn more
                  about using this tool in the{" "}
                  <OutboundLink
                    href="https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql"
                    className="link"
                  >
                    Gatsby tutorial
                  </OutboundLink>
                  .
                </p>
              </li>
              <li>
                <h2>Hosting</h2>
                <p>
                  Follow{" "}
                  <OutboundLink
                    href="https://www.netlify.com/blog/2016/02/24/a-step-by-step-guide-gatsby-on-netlify/"
                    className="link"
                  >
                    this great tutorial
                  </OutboundLink>{" "}
                  to publish your site to Netlify!
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  </>
)

export default FairUsePage
