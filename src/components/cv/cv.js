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
        <div className="pad-3">
          <div className="row">
            <div className="col-xs-12">
              <Title basics={data.basics} socials={data.socials} />
            </div>
          </div>
          <div className="line is-light-grey-always margin-3-b" />
          <div className="row">
            <div className="col-xs-3">
              <Education education={data.education} />
              <div className="line is-light-grey-always margin-3-b margin-3-t" />
              <Languages languages={data.languages} />
              <div className="line is-light-grey-always margin-3-b" />
              <Skills skills={data.skills} />
            </div>
            <div className="col-xs-9 pad-6-l">
              <Experience experience={data.experience} />
              <div className="line is-light-grey-always margin-3-b margin-3-t" />
              <Projects projects={data.projects} />
              <div className="line is-light-grey-always margin-3-b margin-3-t" />
              <h4 className="is-dark-blue-always">
                References can be supplied upon request
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
