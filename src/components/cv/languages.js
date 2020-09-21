import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-green-always subtitle">Technical Experience</h3>
      {props.languages.nodes.map(item => (
        <div className="margin-2-t is-white-always">
          <h4 className="margin-0-b">{item.name}</h4>
          <div className="margin-0 margin-2-t flex flex-wrap">
            {item.languages.map(lang => (
              <div className="is-green-bg is-white margin-1-r tag margin-2-b">
                {lang.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
