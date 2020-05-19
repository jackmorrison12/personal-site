import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-dark-blue-always">Experience</h3>
      {props.experience.nodes.map(item => (
        <div className="margin-3-t">
          <h4 className="margin-0-b">{item.frontmatter.title}</h4>
          <h5 className="margin-0">{item.frontmatter.subtitle}</h5>
          <p className="margin-0-t italic">
            {item.frontmatter.startdate} - {item.frontmatter.enddate}
          </p>
          {item.frontmatter.longhighlights.map(highlight => (
            <p className="bullet pad-5-l">{highlight.highlight}</p>
          ))}
        </div>
      ))}
    </>
  )
}