import React, { useState } from "react"
import { useEducationData } from "../../hooks/use-education-data"
import { useExperienceData } from "../../hooks/use-experience-data"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { Twemoji } from "react-emoji-render"

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"

import { SlideDown } from "react-slidedown"
import "react-slidedown/lib/slidedown.css"

export const ExperienceTimeline = () => {
  const data = useExperienceData()
  const [open, setOpen] = useState(new Array(data.length).fill(false))

  function flipOpen(index) {
    let newArr = [...open]
    newArr[index] = !open[index]
    setOpen(newArr)
  }
  return (
    <VerticalTimeline>
      {data.map((item, i) => {
        let data = item.node.frontmatter
        let html = item.node.html
        return (
          <VerticalTimelineElement
            className="vertical-timeline-element poppins"
            contentStyle={{ color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date={item.dates}
            iconStyle={{ color: "#fff" }}
            key={i}
          >
            <h4 className="vertical-timeline-element-subtitle">
              {data.subtitle}
            </h4>
            <h2 className="vertical-timeline-element-title">
              <OutboundLink
                href={data.url}
                className="link is-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.title}
              </OutboundLink>
            </h2>
            <h4 className="vertical-timeline-element-subtitle pad-2-b">
              {data.startdate} - {data.enddate}
            </h4>

            {data.shorthighlights.map(i => (
              <p className="vertical-timeline-element-badge">
                <Twemoji svg text="⭐️ " />
                {i.highlight}
              </p>
            ))}
            {/* <p>{item.summary}</p> */}

            <SlideDown closed={!open[i]}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </SlideDown>
            <div
              role="button"
              tabIndex="0"
              onClick={e => flipOpen(i)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  flipOpen(i)
                }
              }}
              className={"link float-right"}
            >
              {open[i] ? "Read Less" : "Read More"}
            </div>
          </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
  )
}

export const EducationTimeline = () => {
  const data = useEducationData()
  const [open, setOpen] = useState(new Array(data.length).fill(false))

  function flipOpen(index) {
    let newArr = [...open]
    newArr[index] = !open[index]
    setOpen(newArr)
  }
  return (
    <VerticalTimeline>
      {data.map((item, i) => {
        let data = item.node.frontmatter
        let html = item.node.html
        return (
          <VerticalTimelineElement
            className="vertical-timeline-element poppins"
            contentStyle={{ color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid white" }}
            date={item.dates}
            iconStyle={{ color: "#fff" }}
            key={i}
          >
            <h4 className="vertical-timeline-element-subtitle">
              {data.subtitle}
            </h4>
            <h2 className="vertical-timeline-element-title">
              <OutboundLink
                href={data.url}
                className="link is-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.title}
              </OutboundLink>
            </h2>
            <h4 className="vertical-timeline-element-subtitle pad-2-b">
              {data.startdate} - {data.enddate}
            </h4>

            {data.highlights
              ? data.highlights.map(i => (
                  <p className="vertical-timeline-element-badge">
                    <Twemoji svg text="⭐️ " />
                    {i.name}: {i.score ? i.score : ""}
                  </p>
                ))
              : ""}

            {data.commendations
              ? data.commendations.map(i => (
                  <p className="vertical-timeline-element-badge">
                    <Twemoji svg text="🏆 " />
                    {i.name} - <i>{i.awarder}</i>
                  </p>
                ))
              : ""}

            <SlideDown closed={!open[i]}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </SlideDown>
            <div
              role="button"
              tabIndex="0"
              onClick={e => flipOpen(i)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  flipOpen(i)
                }
              }}
              className={"link float-right"}
            >
              {open[i] ? "Read Less" : "Read More"}
            </div>
          </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
  )
}
