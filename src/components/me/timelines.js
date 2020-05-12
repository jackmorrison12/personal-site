import React from "react"

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import educationData from "../../data/education.json"
import experienceData from "../../data/experience.json"


export const ExperienceTimeline = () => (
    <VerticalTimeline>
        {experienceData.map((item) => (
            <VerticalTimelineElement
                className="vertical-timeline-element poppins"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date="2011 - present"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            >
                <h3 className="vertical-timeline-element-title">{item.name}</h3>
                <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4>
                <p>
                {item.desc}
                </p>
            </VerticalTimelineElement>
        ))}

        
    </VerticalTimeline>
)

export const EducationTimeline = () => (
    <VerticalTimeline>
        <VerticalTimelineElement
            className="vertical-timeline-element--left poppins"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
        >
            <h3 className="vertical-timeline-element-title">Creative Director</h3>
            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
            <p>
            Creative Direction, User Experience, Visual Design, Project Management, Team Leading
            </p>
        </VerticalTimelineElement>
    </VerticalTimeline>
)