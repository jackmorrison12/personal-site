import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-green-always subtitle">Skills</h3>
      {props.skills.nodes.map(item => (
        <div className="margin-3-t">
          <h4 className="margin-0-b">{item.name}</h4>
          <p className="margin-0">{item.summary}</p>
        </div>
      ))}
    </>
  )
}
