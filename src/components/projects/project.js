import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

import Tags from "../misc/tags"

export default props => (
  <div
    className={
      "col-xs-12 margin-3-b" + (props.halfwidth ? " col-md-6 pad-2-lr" : "")
    }
  >
    <div className="grow project non-featured is-white-bg">
      <Link to={"/" + props.project.fullurl} className="" id="path">
        <div className="row">
          <div className="col-xs-12 pad-0 mobile-show">
            <Img fluid={props.project.banner.childImageSharp.fluid} />
          </div>
          <div className="col-sm-4 pad-0 mobile-hide">
            <Img fluid={props.project.hero.childImageSharp.fluid} />
          </div>
          <div className="col-xs-12 col-sm-8">
            <div className="pad-2 pad-5-t">
              <h2 className="is-primary margin-0">{props.project.title}</h2>
              <p className=" margin-0-t margin-2-b is-black bold">
                {props.project.startdate !== props.project.enddate
                  ? props.project.startdate + " - " + props.project.enddate
                  : props.project.startdate}
              </p>
              <Tags tags={props.project.tags} />
              <p className="margin-0 is-black">{props.project.description}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  </div>
)
