import React from "react"
import ReactDOM from "react-dom";

import Emoji from 'a11y-react-emoji'

import Layout from "../components/layout"
import SEO from "../components/seo"
import CV from "../components/cv/cv"
import { savePDF } from "@progress/kendo-react-pdf";


class CVPage extends React.Component {
  render () {
    return (
      <Layout>
        <SEO title="CV" />
        <div className="is-grey is-light-grey-bg pad-10-tb pad-3-lr">
          <div className="row container ">
            <div className="col-xs-12 ">
              <h1 className="is-hero-menu margin-0-t">CV</h1>
              <div className="mobile-hide" ref={cv => (this.cv = cv)}>
                <CV />
              </div>
              <div className="mobile-show">
                <p>Unfortunately, it looks like your screen is a little too small to display my CV <Emoji symbol="😢" label="sad" />. Maybe come back and take a look when you find a bigger screen!</p>
                <p>You can download a PDF copy instead if you'd like <Emoji symbol="😍" label="heart-eyes" /></p>
              </div>
              <button className="btn-center is-red-bg is-black is-red-border margin-10-t" onClick={this.exportPDFWithMethod}>
                Download CV
              </button>
            </div>
          </div>  
        </div>
      </Layout>
    )
  }
  exportPDFWithMethod = () => {
    savePDF(ReactDOM.findDOMNode(this.cv), {
        paperSize: "auto",
        margin: 0,
        fileName: `jack-morrison-cv`,
        author: "Jack Morrison",
        creator: "Jack Morrison",
        keywords: "Jack Morrison, Imperial College London, CV",
        producer: "https://jackmorrison.xyz",
        subject: "Jack Morrison's CV",
        title: "Jack Morrison's CV"
    });
  };
}



export default CVPage
