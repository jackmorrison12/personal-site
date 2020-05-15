import React from "react"
import { graphql, Link } from "gatsby"
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticlePreviews from "../components/articles/articlepreviews"
import BlogPreviews from "../components/blog/blogpreviews"
import ProjectPreviews from "../components/projects/projectpreviews"

import socials from "../data/socials.json"
library.add(fab);

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <div className=" is-light-grey-bg is-black">
        <div className="row">
          <div className="col-xs-12 col-sm-6 pad-5-lr container-small pad-5-t pad-5-b">
            <h1 className="is-hero-menu margin-0">Jack Morrison</h1>
            <h3 className="is-hero-sub-text">Computing Student @ <a className="is-red link" href="https://www.imperial.ac.uk/computing" target="_blank" rel="noopener noreferrer">Imperial</a></h3>
            <div className="line margin-10-t margin-10-b" />
            <div className="">
              {socials
              .filter((item) => item.home)
              .map((item) => (
                <a href={item.url} className="is-black pad-2 col-xs-3">
                  <FontAwesomeIcon icon={['fab', item.icon]} size="2x" className="grow-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="row col-xs-12 col-sm-6 pad-0 mobile-hide">
            {data.allFile.edges.map((edge, i) => 
              <div key={i} className="col-xs-6 col-sm-4 pad-0">
                <Img style={{opacity: 0.4}} fluid={edge.node.childImageSharp.fluid} />
              </div>
            )}     
        </div>
        </div>
      </div>
      <div className="is-red-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12">
            <h2>Projects I've been working on</h2>
            <ProjectPreviews/>
          </div>
        </div>
      </div>
      <div className="is-light-grey-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12">
            <h2>My Latest Articles</h2>
            <ArticlePreviews/>
          </div>
        </div>
      </div>
      <div className="is-red-bg is-black diagonal-box">
        <div className="row container-small pad-20-t pad-3-lr pad-20-b content">
          <div className="col-xs-12">
            <h2>My Latest Blog</h2>
            <BlogPreviews />
          </div>
        </div>
      </div>
      <div className="is-light-grey-bg is-black ">
        <div className="row container-small pad-20-t pad-3-lr pad-10-b ">
          <div className="col-xs-12">
            <h2 className="text-align-center">Want to know more?</h2>
            <Link to="/cv" className="btn-center is-red-bg is-black">Read my CV</Link>

          </div>
        </div>
      </div>
    </Layout>
  )
}


export const query = graphql`
  query {
    allFile(filter: {relativeDirectory: {eq: "me-page"}}, sort: {fields: id}
            limit: 6) {
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