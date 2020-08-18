import React, { useState } from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Education from "../components/me/education"
import Experience from "../components/me/experience"
import Map from "../components/me/map"
import Music from "../components/me/music"
import Skydiving from "../components/me/skydiving"
import Teaching from "../components/me/teaching"

import { SlideDown } from "react-slidedown"
import "react-slidedown/lib/slidedown.css"
import { Twemoji } from "react-emoji-render"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

export default ({ data }) => {
  const [section, setSection] = useState("NONE")
  const [open, setOpen] = useState(false)

  function sectionSwitch(s) {
    switch (s) {
      case "EDUCATION":
        return <Education />
      case "EXPERIENCE":
        return <Experience />
      case "MAP":
        return <Map />
      case "MUSIC":
        return <Music />
      case "SKYDIVING":
        return <Skydiving />
      case "TEACHING":
        return <Teaching />
      default:
        return ""
    }
  }

  function makeLink(link, text, colour) {
    return (
      <span
        role="button"
        tabIndex="0"
        onClick={e => {
          setSection(link)
          setOpen(true)
          trackCustomEvent({
            category: "Me Page Link",
            action: "click",
            label: text,
          })
        }}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            setSection(link)
            setOpen(true)
            trackCustomEvent({
              category: "Me Page Link",
              action: "click",
              label: text,
            })
          }
        }}
        className={"link is-" + colour}
      >
        {text}
      </span>
    )
  }

  return (
    <Layout>
      <SEO title="Me" />
      <div className="me-hero">
        <h1 className="me-hero-title title margin-0-t">
          <Twemoji svg text="Hey 👋 I'm Jack" />
        </h1>
      </div>
      <div className="row">
        {data.allFile.edges.map((edge, i) => (
          <div key={i} className="col-xs-4 col-sm-2 pad-0">
            <Img
              style={{ opacity: 0.4 }}
              fluid={edge.node.childImageSharp.fluid}
            />
          </div>
        ))}
      </div>
      <div className="is-light-grey-bg">
        <div className="row container pad-10-tb pad-3-lr">
          <div className="col-xs-12 col-md-12">
            <h1 className="title margin-0-t">About me (in 40 words)</h1>
            <h2>
              {" "}
              I'm a Software Engineer from London. I'm currently studying
              Computing at{" "}
              {makeLink("EDUCATION", "Imperial College London", "red")}. I've
              worked as a Software Engineer at{" "}
              {makeLink("EXPERIENCE", "NextJump", "red")} and{" "}
              {makeLink("EXPERIENCE", "Facebook", "red")}. I've dabbled in{" "}
              {makeLink("TEACHING", "teaching", "red")}. I enjoy{" "}
              {makeLink("MUSIC", "making music", "red")},{" "}
              {makeLink("MAP", "travelling", "red")}, and am currently learning
              how to {makeLink("SKYDIVING", "skydive", "red")}.
            </h2>
            <p>Click any of the links above to find out more!</p>
          </div>
        </div>
      </div>
      <SlideDown closed={!open}>
        <div className="is-white-bg">
          <div className="row pad-10-t pad-3-lr container">
            <div className="col-xs-12 col-md-12">
              <div
                role="button"
                tabIndex="0"
                onClick={e => {
                  setOpen(false)
                  trackCustomEvent({
                    category: "Me Page Link",
                    action: "click",
                    label: "Close",
                  })
                }}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    setOpen(false)
                    trackCustomEvent({
                      category: "Me Page Link",
                      action: "click",
                      label: "Close",
                    })
                  }
                }}
                className="link is-medium-blue float-right"
              >
                Close
              </div>
            </div>
          </div>
          <div
            className={
              "row pad-10-b pad-3-lr " +
              (section === "EXPERIENCE" || section === "EDUCATION"
                ? ""
                : "container")
            }
          >
            {sectionSwitch(section)}
          </div>
        </div>
      </SlideDown>
    </Layout>
  )
}

export const query = graphql`
  query {
    allFile(
      filter: { relativeDirectory: { eq: "me-page" } }
      sort: { fields: id }
    ) {
      edges {
        node {
          childImageSharp {
            id
            fluid(cropFocus: CENTER, maxHeight: 400, maxWidth: 400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
