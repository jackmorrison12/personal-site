import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import navlinks from "../data/navigation.json"

const Header = () => (
  <header>
    <div className="is-white-bg pad-5">
      <div className="row flex padding-0-tb container-small">
        {/* <div className="col-xs-3 flex">
          <h1 className="margin-0">
            <Link to="/" className="is-black">
              Jack Morrison
            </Link>
          </h1>
        </div> */}
        <div
          className="col-xs-12"
          style={{ justifyContent: "flex-end", alignItems: "center" }}
        >
          <div className="row flex text-align-center">
              {navlinks
                .map((item) => (
                  <div className="col-xs-6 col-md-2 col-lg-2">
                    <h3 className="margin-0"><Link to={item.link} className="is-black"> {item.name} </Link></h3>
                  </div>
                ))}
            </div>
        </div>

      </div>


      
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
