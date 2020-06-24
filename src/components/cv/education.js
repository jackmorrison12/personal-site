import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-green-always subtitle">Education</h3>
      {props.education.nodes.map(item => (
        <div className="margin-3-t is-white-always">
          <h4 className="margin-0-b">{item.frontmatter.title}</h4>
          <h5 className="margin-0">{item.frontmatter.subtitle}</h5>
          <p className="margin-0-t italic">
            {item.frontmatter.startdate} - {item.frontmatter.enddate}
          </p>
          {item.frontmatter.grade_summaries.map(grade => (
            <p className="bullet">{grade.grade}</p>
          ))}
        </div>
      ))}
    </>
  )
}
