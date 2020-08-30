import React from "react"

import { OutboundLink } from "gatsby-plugin-google-analytics"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import socials from "../../data/socials.json"

export default props => (
  <div className="text-align-center row content-center">
    {socials
      .filter(item => item.home)
      .map(item => (
        <OutboundLink
          href={item.url}
          className="is-white-always pad-2 col-xs-4 col-sm-1"
        >
          {props.recents[item.identifier] && props.showRecents ? (
            //Make flaming
            <FontAwesomeIcon
              icon={["fab", item.icon]}
              size="2x"
              className={"grow-5 flame " + item.identifier + "-colour"}
            />
          ) : (
            <FontAwesomeIcon
              icon={["fab", item.icon]}
              size="2x"
              className={"grow-5  " + item.identifier + "-colour-hover"}
            />
          )}
        </OutboundLink>
      ))}
  </div>
)
