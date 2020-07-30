import React from "react"

import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import WritingRoll from "../components/writing/writingroll"

const WritingPage = () => (
  <Layout>
    <SEO title="Articles" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container-small">
        <div className="col-xs-12 col-md-12">
          <h1 className="title title-borders margin-0-t">I like to write</h1>
          <WritingRoll />
        </div>
      </div>
    </div>
    <div className="is-grey is-white-bg pad-10-tb pad-3-lr">
      <div className="row container-small ">
        <div className="col-xs-12 col-md-12">
          <h3 className="margin-0">
            Looking for something older? Go to the{" "}
            <Link to="articles" className="link">
              article archive
            </Link>{" "}
            or the{" "}
            <Link to="blog" className="link">
              blog archive
            </Link>
            .
          </h3>
        </div>
      </div>
    </div>
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container-small ">
        <div className="col-xs-12 col-md-12">
          <h1>What's the difference?</h1>
          <p>
            This is all subjective, but this is how & why I differentiate them:
          </p>
        </div>
        <div className="col-xs-12 col-md-6">
          <p>
            <b>Articles</b> are usually shorter, more informative pieces of text
            These may, for example, talk through how I created something, or how
            I solved a particular problem. Their purpose is to be informative
            and used as a reference for others. Think of them as the sort of
            thing you would find on Medium.
          </p>
        </div>
        <div className="col-xs-12 col-md-6">
          <p>
            <b>Blog Posts</b> on the other hand are more opinion pieces. They're
            usually longer, and may go into more depth. They may talk about
            something I've worked on, but also could really be about anything.
            Since I don't often get the chance to write long texts that often
            any more, it's a way for me to keep these skills fresh!
          </p>
        </div>
      </div>
    </div>
  </Layout>
)

export default WritingPage
