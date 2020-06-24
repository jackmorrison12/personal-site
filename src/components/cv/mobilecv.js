import React from "react"

import Title from "./titlemobile"
import Education from "./educationmobile"
import Skills from "./skillsmobile"
import Languages from "./languagesmobile"
import Experience from "./experiencemobile"
import Projects from "./projectsmobile"
import useCvData from "../../hooks/use-cv-data"

export default () => {
  const data = useCvData()
  console.log(data)
  return (
    <>
      <div className="mobile-cv">
        <div className="row">
          <div className="col-xs-12 pad-3">
            <Title basics={data.basics} socials={data.socials} />
            <div className="margin-3-b margin-3-t" />
            <Education education={data.education} />
            <div className=" margin-3-b margin-3-t" />
            <Languages languages={data.languages} />
            <div className="margin-3-b" />
            <Skills skills={data.skills} />
            <div className="margin-3-b" />

            <Experience experience={data.experience} />
            <div className="margin-3-b margin-3-t" />
            <Projects projects={data.projects} />
            <div className="margin-3-b margin-3-t" />
            <h4 className="is-green subtitle">
              References can be supplied upon request
            </h4>
          </div>
        </div>
      </div>
    </>
  )
}
