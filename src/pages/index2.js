import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Hero from "../components/hero/hero"
import Socials from "../components/hero/socials"
import ProjectPreviews from "../components/projects/projectpreviewsv2"
import WritingPreviews from "../components/writing/writingpreviews"

export default () => (
  <Layout>
    <SEO title="Home" />
    <Hero />
    <div className="row container-small">
      <div className="col-xs-12 text-align-center">
        <h2>Here's some stuff I've been working on...</h2>
      </div>

      <div className="col-xs-12 col-md-6">
        <h2 className="text-align-center">Projects</h2>
        <ProjectPreviews />
      </div>
      <div className="col-xs-12 col-md-6">
        <h2 className="text-align-center">Articles</h2>
        <WritingPreviews />
      </div>
    </div>
    <form
      method="post"
      netlify-honeypot="bot-field"
      data-netlify="true"
      name="contact"
      className="row text-align-center is-red-bg pad-5"
    >
      <h2 className="col-xs-12">
        Please give me some feedback on the new homepage
      </h2>
      <input type="hidden" name="bot-field" />
      <input type="hidden" name="form-name" value="contact" />
      <label className="col-xs-12 col-md-6 left-xs right-md">Name</label>
      <input type="text" name="name" id="name" className="col-xs-12 col-md-4" />
      <label className="col-xs-12 col-md-6 left-xs right-md">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        className="col-xs-12 col-md-4"
      />
      <label className="col-xs-12 col-md-6 left-xs right-md">
        What do you think of this new home page?
      </label>
      <textarea
        name="message"
        id="message"
        rows="5"
        className="col-xs-12 col-md-4"
      />
      <div className="col-xs-5"></div>
      <button type="submit" className="col-xs-2 margin-3-tb">
        Send
      </button>
    </form>
  </Layout>
)
