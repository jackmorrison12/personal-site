import React from "react"

import Title from "./title"
import Education from "./education"
import Skills from "./skills"
import Languages from "./languages"
import useCvData from "../../hooks/use-cv-data"

export default () => {
    const data = useCvData();
    console.log(data);
    return (
        <>
            <div className="cv">
                <div className="pad-3">
                    <div className="row pad-3-b">
                        <div className="col-xs-12">
                            <Title basics={data.basics} socials={data.socials}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                            <Education education={data.education} />
                            <Languages languages={data.languages} />
                            <Skills skills={data.skills} />
                        </div>
                        <div className="col-xs-9">
                            right col
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}