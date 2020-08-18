import React from "react"
import PropTypes from "prop-types"
import useDarkMode from "use-dark-mode"
import { Link } from "gatsby"

import { Twemoji } from "react-emoji-render"

import { trackCustomEvent } from "gatsby-plugin-google-analytics"

import Header from "./header"

import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"
deckDeckGoHighlightElement()

const Layout = ({ children }) => {
  const darkMode = useDarkMode(true)
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
    <>
      <Header />
      <main className="is-light-grey-bg is-black">{children}</main>
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
          <Link
            to="/credits"
            activeClassName="bold"
            className="is-medium-blue link"
          >
            Credits
          </Link>{" "}
          ●{" "}
          <Link
            to="/tools"
            activeClassName="bold"
            className="is-medium-blue link"
          >
            Tools Used
          </Link>{" "}
          ●{" "}
          <Link
            to="/fair-use"
            activeClassName="bold"
            className="is-medium-blue link"
          >
            Fair Use Policy
          </Link>{" "}
          ●{" "}
          <Link
            to="/archive"
            activeClassName="bold"
            className="is-medium-blue link"
          >
            Archive
          </Link>
        </div>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
