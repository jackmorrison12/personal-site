import React from "react"

export default (props) => {
    return (
        <>
            <h3 className="is-dark-blue-always">Technical Experience</h3>      
            {
                props.languages.nodes.map((item) => (
                    <div className="pad-3-b">
                        <h4 className="margin-0-b">{item.name}</h4>
                        <div className="row pad-2-t">
                            {
                                item.languages.map((lang) => (
                                    <div className="col-xs-6">
                                        <p className="margin-0">{lang.name}</p>
                                    </div>
                                ))
                            }
                            
                        </div>

                    </div>
                ))
            }
        </>
    )
}