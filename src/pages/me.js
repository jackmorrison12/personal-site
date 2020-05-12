import React, {useState} from "react"
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

import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'

export default ({ data }) => {
  const [section, setSection] = useState("NONE")
  const [open, setOpen] = useState(false)


  function sectionSwitch(s) {

    switch(s) {
      case 'EDUCATION':
        return <Education />;
      case 'EXPERIENCE':
        return <Experience />;
      case 'MAP':
        return <Map />;
      case 'MUSIC':
        return <Music />;
      case 'SKYDIVING':
        return <Skydiving />;
      case 'TEACHING':
        return <Teaching />;
      default:
        return "";
    }
  }

  return (
    <Layout>
      <SEO title="Me" />
        <div className="me-hero">
              <h1 className="me-hero-title is-hero-menu margin-0-t">Hey 👋 I'm Jack</h1>
        </div>
        <div className="row">
            {data.allFile.edges.map(edge => 
              <div className="col-xs-4 col-sm-2 pad-0">
                <Img style={{opacity: 0.4}} fluid={edge.node.childImageSharp.fluid} />
              </div>
            )}     
        </div>
        <div className="is-light-grey-bg">
          <div className="row container pad-10-tb pad-3-lr">
            <div className="col-xs-12 col-md-12">
              <h1 className="is-hero-menu margin-0-t">About me (in 40 words)</h1>
              <h2> I'm a Software Engineer from London. I'm currently studying Computing at <span onClick={e => {setSection("EDUCATION"); setOpen(true)}} className="btn is-red">Imperial College London</span>. I've worked as a Software Engineer at <span onClick={e => {setSection("EXPERIENCE"); setOpen(true)}} className="btn is-medium-blue">NextJump</span> and <span onClick={e => {setSection("EXPERIENCE"); setOpen(true)}} className="btn is-medium-blue">Facebook</span>. I've dabbled in <span onClick={e => {setSection("TEACHING"); setOpen(true)}}className="btn is-red">teaching</span>. I enjoy <span onClick={e => {setSection("MUSIC"); setOpen(true)}}className="btn is-red">making music</span>, <span onClick={e => {setSection("MAP"); setOpen(true)}}className="btn is-red">travelling</span>, and am currently learning how to <span onClick={e => {setSection("SKYDIVING"); setOpen(true)}} className="btn is-red">skydive</span>.</h2>
              <p>Click any of the links above to find out more!</p>
            </div>
          </div>
        </div>
        <SlideDown closed={!open}>
        <div className="is-white-bg">
          <div className="row container pad-10-tb pad-3-lr ">
            <div className="col-xs-12 col-md-12">
              <div onClick={e => setOpen(false)} className="btn is-medium-blue text-align-right">Close</div>
              {
                sectionSwitch(section)
              }
            </div>
          </div>
        </div>
        </SlideDown>
        <div className="is-light-grey-bg">
          <div className="row container pad-10-tb pad-3-lr ">
            <div className="col-xs-12 col-md-12">
              <h1 className="is-hero-menu margin-0-t text-align-center pad-10-tb">Want a familiar format?</h1>
              <p className="btn text-align-center">Read my CV here</p>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allFile(filter: {relativeDirectory: {eq: "me-page"}}, sort: {fields: id}) {
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