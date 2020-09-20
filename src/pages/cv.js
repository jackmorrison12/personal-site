import React from "react"
import ReactDOM from "react-dom"

import Layout from "../components/layout"
import SEO from "../components/seo"
import CV from "../components/cv/cv"
import MobileCV from "../components/cv/mobilecv"

import { savePDF } from "@progress/kendo-react-pdf"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

class CVPage extends React.Component {
  render() {
    return (
      <Layout>
        <SEO title="CV" />
        <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
          <div className="row container ">
            <div className="col-xs-12 ">
              <div className="mobile-hide" ref={cv => (this.cv = cv)}>
                <CV />
              </div>
              <div className="mobile-hide">
                <button
                  className="btn-center is-primary-bg is-black is-primary-border margin-10-t"
                  onClick={this.exportPDFWithMethod}
                >
                  Download CV
                </button>
              </div>
              <div className="mobile-show">
                <MobileCV />
              </div>
            </div>{" "}
          </div>
        </div>
      </Layout>
    )
  }
  exportPDFWithMethod = () => {
    trackCustomEvent({
      category: "Button",
      action: "click",
      label: "CV Download",
    })
    savePDF(ReactDOM.findDOMNode(this.cv), {
      paperSize: "auto",
      margin: 0,
      fileName: `jack-morrison-cv`,
      author: "Jack Morrison",
      creator: "Jack Morrison",
      keywords: "Jack Morrison, Imperial College London, CV",
      producer: "https://jackmorrison.xyz",
      subject: "Jack Morrison's CV",
      title: "Jack Morrison's CV",
    })
  }
}

export default CVPage
