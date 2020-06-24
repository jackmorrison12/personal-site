import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-green-always subtitle">Projects</h3>
      {props.projects.nodes.map(item => (
        <div className="margin-3-t">
          <a href={"https://jackmorrison.xyz" + item.frontmatter.slug}>
            <h3 className="margin-0-b is-black">{item.frontmatter.title}</h3>
          </a>
          <p className="margin-0-t italic">
            {item.frontmatter.startdate} - {item.frontmatter.enddate}
          </p>
          {item.frontmatter.highlights.map(highlight => (
            <p className="bullet pad-5-l pad-2-b">{highlight.highlight}</p>
          ))}
        </div>
      ))}
    </>
  )
}
