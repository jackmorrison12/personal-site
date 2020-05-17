import React from "react"

export default (props) => {
    return (
        <>
            <h1 className="text-align-left margin-0 margin-2-t">{props.basics.name}</h1>
            <div className="is-dark-blue-always">
                {
                    props.socials.nodes.map ((item) => (
                        <span><a className="is-dark-blue-always" href={item.url}> {item.username}</a></span>
                    )).reduce((prev, curr) => [prev, '\xa0\xa0|\xa0\xa0', curr])
                }
            </div>
            
        </>
    )
}