import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-dark-blue-always">Projects</h3>
      {props.projects.nodes.map(item => (
        <div className="margin-3-t">
          <a href={"https://jackmorrison.xyz" + item.frontmatter.slug}>
            <h4 className="margin-0-b is-black-always">
              {item.frontmatter.title}
            </h4>
          </a>
          <p className="margin-0-t italic">
            {item.frontmatter.startdate} - {item.frontmatter.enddate}
          </p>
          {item.frontmatter.highlights.map(highlight => (
            <p className="bullet pad-5-l">{highlight.highlight}</p>
          ))}
        </div>
      ))}
    </>
  )
}
