import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"

export default props => (
  <div
    className={
      "col-xs-12 margin-3-b" + (props.halfwidth ? " col-md-6 pad-2-lr" : "")
    }
  >
    <div className="grow project non-featured is-white-bg">
      <Link to={"/" + props.writing.fullurl} className="" id="path">
        <div className="row">
          <div className="col-xs-12 pad-0 mobile-show">
            <Img fluid={props.writing.hero.childImageSharp.fluid} />
          </div>
          <div className="col-sm-4 pad-0 mobile-hide">
            <Img fluid={props.writing.logo.childImageSharp.fluid} />
          </div>
          <div className="col-xs-12 col-sm-8">
            <div className="pad-2 pad-5-t">
              <h2 className="is-primary margin-0">{props.writing.title}</h2>
              {props.writing.series ? (
                <>
                  <h4 className="margin-0 is-black">{props.writing.series}</h4>
                  <h4 className="margin-0 is-primary">
                    Part {props.writing.entry} of {props.writing.totalentries}
                  </h4>
                </>
              ) : (
                ""
              )}
              <p className=" margin-0-t margin-2-b is-black bold">
                {props.writing.daystartdate &&
                props.writing.daystartdate !== props.writing.date
                  ? props.writing.daystartdate + " - "
                  : ""}
                {props.writing.date}
              </p>
              {props.writing.series ? (
                ""
              ) : (
                <div className="margin-0 margin-1-t flex flex-wrap">
                  {props.writing.tags.map(item => (
                    <div class="is-primary-bg is-white margin-2-b margin-1-r tag">
                      {item}
                    </div>
                  ))}
                </div>
              )}
              <p className="margin-0 is-black">{props.writing.description}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  </div>
)
