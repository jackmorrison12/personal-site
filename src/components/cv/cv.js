import React from "react"

import Title from "./title"
import Education from "./education"
import Skills from "./skills"
import Languages from "./languages"
import Experience from "./experience"
import Projects from "./projects"
import useCvData from "../../hooks/use-cv-data"

export default () => {
  const data = useCvData()
  console.log(data)
  return (
    <>
      <div className="cv">
        <div className="row inner">
          <div className="col-xs-4 is-black-bg-always pad-3">
            <Title basics={data.basics} socials={data.socials} />
            <div className="margin-3-b margin-3-t" />
            <Education education={data.education} />
            <div className=" margin-3-b margin-3-t" />
            <Languages languages={data.languages} />
            <div className="margin-3-b" />
            <Skills skills={data.skills} />
          </div>
          <div className="col-xs-8 pad-3-l pad-3">
            <Experience experience={data.experience} />
            <div className="margin-3-b margin-3-t" />
            <Projects projects={data.projects} />
            <div className="margin-3-b margin-3-t" />
            <h4 className="is-green-always subtitle">
              References can be supplied upon request
            </h4>
          </div>
        </div>
      </div>
    </>
  )
}
