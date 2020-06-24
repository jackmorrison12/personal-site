import React from "react"

export default props => {
  return (
    <>
      <h1 className="is-white-always text-align-center margin-0 margin-2-tb">
        {props.basics.name}
      </h1>
      <div className="is-green-always text-align-center">
        {props.socials.nodes.map(item => (
          <div>
            <a className="is-green-always" href={item.url}>
              {item.username}
            </a>
          </div>
        ))}
      </div>
    </>
  )
}
