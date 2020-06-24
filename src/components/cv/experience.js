import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-green-always subtitle">Experience</h3>
      {props.experience.nodes.map(item => (
        <div className="margin-3-t">
          <h3 className="margin-0-b">{item.frontmatter.title}</h3>
          <h5 className="margin-0">{item.frontmatter.subtitle}</h5>
          <p className="margin-0-t italic">
            {item.frontmatter.startdate} - {item.frontmatter.enddate}
          </p>
          {item.frontmatter.longhighlights.map(highlight => (
            <p className="bullet pad-5-l pad-2-b">{highlight.highlight}</p>
          ))}
        </div>
      ))}
    </>
  )
}
