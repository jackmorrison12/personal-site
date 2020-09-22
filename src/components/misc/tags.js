import React from "react"
import { Link } from "gatsby"

const _ = require("lodash")

export default props => {
  return (
    <div className="margin-0 margin-1-t flex flex-wrap">
      {props.series || props.article ? (
        <Link to={props.series ? "/blog" : "/articles"}>
          <div class="is-primary-bg is-white margin-2-b margin-1-r tag grow-2">
            {props.series ? "Blog Series" : "Article"}
          </div>
        </Link>
      ) : (
        ""
      )}
      {props.tags.map(item => (
        <Link to={"/tags/" + _.kebabCase(item)}>
          <div class="is-primary-bg is-white margin-2-b margin-1-r tag grow-2">
            {item}
          </div>
        </Link>
      ))}
    </div>
  )
}
