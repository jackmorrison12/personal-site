import React, { useState, useEffect } from "react"

import { OutboundLink } from "gatsby-plugin-google-analytics"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import socials from "../../data/socials.json"

export default props => {
  const [recents, setRecents] = useState([])

  useEffect(() => {
    var url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://api.jackmorrison.xyz"

    fetch(url + "/getRecents")
      .then(response => response.json())
      .then(result => {
        setRecents(result)
        console.log(result)
      })
      .catch(error => console.log("error", error))
  }, [])

  return (
    <div className="text-align-center row content-center">
      {socials
        .filter(item => item.home)
        .map(item => (
          <OutboundLink
            href={item.url}
            className="is-white-always pad-2 col-xs-4 col-sm-1"
          >
            {props.showRecents && recents[item.identifier] ? (
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
}
