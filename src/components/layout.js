/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
// import { useStaticQuery, graphql, Link } from "gatsby"
import useDarkMode from "use-dark-mode"
import { Link } from "gatsby"

import Header from "./header"

const Layout = ({ children }) => {
  const darkMode = useDarkMode(true)
  function switchDarkMode() {
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
          Light{"    "}
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
          Dark
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
