import React from "react"
import Emoji from 'a11y-react-emoji'

import Title from "./title"
import useCvData from "../../hooks/use-cv-data"

export default () => {
    const data = useCvData();
    console.log(data);
    return (
        <>
            <div className="cv">
                <div className="pad-3">
                    <Title basics={data.basics} socials={data.socials}/>
                </div>
            </div>
        </>
    )
}