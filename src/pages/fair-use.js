import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { Twemoji } from "react-emoji-render"

import useHowToUseRepoData from "../hooks/use-how-to-use-repo-data"

const FairUsePage = () => {
  var html = useHowToUseRepoData()

  return (
    <>
      <Layout>
        <SEO title="Fair Use Policy" />
        <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
          <div className="row container ">
            <div className="col-xs-12 ">
              <h1 className="margin-0-t title title-borders">
                Fair Use Policy
              </h1>
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
                Netlify tracks this repository and updated the live site
                whenever changes are made
              </p>
            </div>
            <div className="col-xs-12 col-sm-6">
              <OutboundLink href="https://github.com/jackmorrison12/personal-site">
                <img
                  style={{ maxWidth: "100%" }}
                  src="https://gh-card.dev/repos/jackmorrison12/personal-site.svg"
                  alt="Personal Site GitHub Repo"
                />
              </OutboundLink>
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
              <div
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default FairUsePage
