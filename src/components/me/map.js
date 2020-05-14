import React from "react"
import Emoji from 'a11y-react-emoji'

export default () => {
    return (
        <>
            <h1 className="col-xs-12"><Emoji symbol="📌" label="pin" /> Map</h1>  
            <div className="col-xs-12 col-md-6">
                <p>
                    I used to have a JavaScript map here, however it was tripling the build time for my site. I'm currently working on an alternative.
                </p>
            </div>
        </>
    )
}