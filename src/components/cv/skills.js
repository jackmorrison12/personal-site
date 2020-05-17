import React from "react"

export default (props) => {
    return (
        <>
            <h3 className="is-dark-blue-always">Skills</h3>      
            {
                props.skills.nodes.map((item) => (
                    <div className="pad-3-b">
                        <h4 className="margin-0-b">{item.name}</h4>
                        <p className="margin-0">{item.summary}</p>
                    </div>
                ))
            }
        </>
    )
}