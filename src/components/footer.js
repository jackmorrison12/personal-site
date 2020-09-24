import { Link } from "gatsby"
import React from "react"
import { Twemoji } from "react-emoji-render"
import useDarkMode from "use-dark-mode"
import footerlinks from "../data/footer.json"

import { trackCustomEvent } from "gatsby-plugin-google-analytics"

export default ({ data }) => {
  const darkMode = useDarkMode()
  function switchDarkMode() {
    trackCustomEvent({
      category: "Button",
      action: "click",
      label: "Dark Mode Toggle",
    })
    var toggle = document.getElementById("dark-mode-switch")
    if (toggle.checked) {
      darkMode.enable()
    } else {
      darkMode.disable()
    }
  }

  return (
    <footer className="is-white-bg is-black pad-2">
      <div className="dark-toggle">
        <Twemoji svg text="☀️" />
        {"    "}
        <label className="switch">
          <input
            type="checkbox"
            id="dark-mode-switch"
            onChange={() => switchDarkMode()}
            checked={darkMode.value}
          />
          <span className="slider round"></span>
        </label>
        {"    "}
        <Twemoji svg text="🌙" />
      </div>
      <div>
        {footerlinks.map((item, i) =>
          !item.hidden ? (
            <>
              <Link
                to={item.link}
                activeClassName="bold"
                className="is-medium-blue link"
              >
                {item.name}
              </Link>{" "}
              {footerlinks.length != i + 1 ? " ● " : ""}
            </>
          ) : (
            ""
          )
        )}
      </div>
    </footer>
  )
}
