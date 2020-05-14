import React, {useState} from "react"
import Emoji from 'a11y-react-emoji'
import Map from './map-js'

export default () => {
    const [showMap, setShowMap] = useState(false)
    return (
        <>
            <h1 className="col-xs-12"><Emoji symbol="📌" label="pin" /> Map</h1>  
            <div className="col-xs-12 col-md-6">
                <p>
                    The map is still in beta. It is very JavaScript intensive, and is not yet optimised. It may cause layout issues with the page. Please click the button if you want to load it.
                </p>
            </div>
            <div className="btn-center is-red-bg" role="button" tabIndex="0" onClick={e => {setShowMap(!showMap)}} onKeyDown={e => { if (e.keyCode === 13) {setShowMap(!showMap)}}} >{showMap ? "Hide Map" : "Show Map"}</div>
            {showMap ? <Map /> : ""}
    
        </>
    )
}