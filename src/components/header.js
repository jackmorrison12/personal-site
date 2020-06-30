import { Link } from "gatsby"
import React, { useState } from "react"
import navlinks from "../data/navigation.json"
import { SlideDown } from "react-slidedown"
import { HamburgerButton } from "react-hamburger-button"
import "react-slidedown/lib/slidedown.css"
import { Twemoji } from "react-emoji-render"
import useDarkMode from "use-dark-mode"

export default ({ data }) => {
  const [open, setOpen] = useState(false)
  const darkMode = useDarkMode(true)

  return (
    <header>
      <div className="is-white-bg pad-5">
        <div className="row flex padding-0-tb container-small mobile-hide">
          <div className="col-xs-12">
            <div className="row flex text-align-center content-center">
              {navlinks.map((item, i) =>
                !item.hidden ? (
                  <div key={i} className="col-xs-6 col-md-2 col-lg-2">
                    <h3 className="margin-0">
                      <Link
                        to={item.link}
                        activeClassName="is-red"
                        className="is-black"
                      >
                        <Twemoji svg text={item.name} />
                      </Link>
                    </h3>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </div>
        </div>
        <div className="row flex padding-0-tb container-small mobile-show-flex">
          <div className="col-xs-11"></div>
          <div className="col-xs-1">
            <HamburgerButton
              open={open}
              onClick={() => setOpen(!open)}
              width={18}
              height={15}
              strokeWidth={3}
              color={darkMode.value ? "white" : "black"}
              animationDuration={0.5}
            />
          </div>
          <SlideDown closed={!open}>
            {open ? (
              <div className="col-xs-12">
                <div className="row flex text-align-center">
                  {navlinks.map((item, i) =>
                    !item.hidden ? (
                      <div key={i} className="col-xs-6 col-md-2 col-lg-2">
                        <h3 className="margin-0">
                          <Link
                            to={item.link}
                            activeClassName="is-red"
                            className="is-black"
                          >
                            <Twemoji svg text={item.name} />
                          </Link>
                        </h3>
                      </div>
                    ) : (
                      ""
                    )
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </SlideDown>
        </div>
      </div>
    </header>
  )
}
