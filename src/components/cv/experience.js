import React from "react"

export default (props) => {
    return (
        <>
            <h3 className="is-dark-blue-always">Experience</h3>      
            {
                props.experience.nodes.map((item) => (
                    <div className="pad-3-b">
                        <h4 className="margin-0-b">{item.frontmatter.title}</h4>
                        <h5 className="margin-0">{item.frontmatter.subtitle}</h5>
                        <p className="margin-0-t">{item.frontmatter.startdate} - {item.frontmatter.enddate}</p>
                        {
                            item.frontmatter.longhighlights.map((highlight) => (
                                <li>{highlight.highlight}</li>
                            ))
                        }

                    </div>
                ))
            }
        </>
    )
}