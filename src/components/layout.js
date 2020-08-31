import React from "react"
import PropTypes from "prop-types"
import useDarkMode from "use-dark-mode"
import { Link } from "gatsby"

import { Twemoji } from "react-emoji-render"

import { trackCustomEvent } from "gatsby-plugin-google-analytics"

import Header from "./header"
import Footer from "./footer"

import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"
deckDeckGoHighlightElement()

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="is-light-grey-bg is-black">{children}</main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
