import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Socials from "../components/hero/socials"

const ContactMePage = () => (
  <Layout>
    <SEO title="Contact Me" />
    <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
      <div className="row container ">
        <div className="col-xs-12">
          <h1 className="margin-0-t title title-borders">Contact Me</h1>
          <h1 className="margin-0-b">Where can you reach me?</h1>
          <p className="margin-0-t pad-5-b">
            The pulsing icons have had recent activity!
          </p>
          <Socials showRecents={true} />
          <h1 className="col-xs-12 margin-0-b  pad-5-t">
            If you have any questions, feedback, or just want a chat, pop a
            message here!
          </h1>
          <p className="col-xs-12 margin-0-t">
            This form is created using Netlify, and so when it's submitted, it
            triggers a webhook and sends a push notification to my phone!
          </p>
          <form
            method="post"
            netlify-honeypot="bot-field"
            data-netlify="true"
            name="Contact Me"
            className="row  pad-5-t"
          >
            <input type="hidden" name="bot-field" />
            <input type="hidden" name="form-name" value="contact-me" />
            <label className="col-xs-12 col-md-4 left-xs right-md">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              className="col-xs-12 col-md-6"
            />
            <label className="col-xs-12 col-md-4 left-xs right-md">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="col-xs-12 col-md-6"
            />
            <label className="col-xs-12 col-md-4 left-xs right-md">
              Message:
            </label>
            <textarea
              name="message"
              id="message"
              rows="5"
              className="col-xs-12 col-md-6"
            />
            <div className="col-xs-5"></div>
            <button type="submit" className="col-xs-2 margin-3-tb">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </Layout>
)

export default ContactMePage
