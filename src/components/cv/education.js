import React from "react"

export default (props) => {
    return (
        <>
            <h3 className="is-dark-blue-always">Education</h3>      
            {
                props.education.nodes.map((item) => (
                    <div className="">
                        <h4 className="margin-0-b">{item.frontmatter.title}</h4>
                        <h5 className="margin-0">{item.frontmatter.subtitle}</h5>
                        <p className="margin-0-t">{item.frontmatter.startdate} - {item.frontmatter.enddate}</p>
                        {
                            item.frontmatter.grade_summaries.map((grade) => (
                                <li>{grade.grade}</li>
                            ))
                        }

                    </div>
                ))
            }
        </>
    )
}