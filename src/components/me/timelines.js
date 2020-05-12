import React, {useState} from "react"

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import educationData from "../../data/education.json"
import experienceData from "../../data/experience.json"

import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'


export const ExperienceTimeline = () => {
    const [open, setOpen] = useState(new Array(experienceData.length).fill(false))

    function flipOpen(index) {
        console.log('index: ' + index);
        console.log('open: '+ open);
        let newArr = [...open]; 
        newArr[index] = !open[index]; 
        setOpen(newArr);
    }
    return (
        <VerticalTimeline>
            {experienceData.map((item, i) => (
                <VerticalTimelineElement
                    className="vertical-timeline-element poppins"
                    contentStyle={{ color: '#fff' }}
                    contentArrowStyle={{ borderRight: '7px solid white'}}
                    date={item.dates}
                    iconStyle={{ color: '#fff' }}
                    key={i}
                >
                    <h2 className="vertical-timeline-element-title"><a href={item.url} className="btn is-black"target="_blank" rel="noopener noreferrer">{item.name}</a></h2>
                    <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4>
                    <i>{item.dates}</i>
{/* 
                    {item.highlights.map((i) => (
                        <p>{i.name}</p>
                    ))} */}
                    
                    <SlideDown closed={!open[i]}>
                        <p>{item.desc}</p>
                    </SlideDown>
                    <div role="button" tabindex="0" onClick={e => flipOpen(i)} onKeyDown={e => { if (e.keyCode === 13) {flipOpen(i)}}} className={"btn float-right"}>{open[i] ? "Read Less" : "Read More"}</div>
                </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
    )
}

export const EducationTimeline = () => {
    const [open, setOpen] = useState(new Array(educationData.length).fill(false))

    function flipOpen(index) {
        console.log('index: ' + index);
        console.log('open: '+ open);
        let newArr = [...open]; 
        newArr[index] = !open[index]; 
        setOpen(newArr);
    }

    return (
        <VerticalTimeline>
            {educationData.map((item, i) => (
                <VerticalTimelineElement
                    className="vertical-timeline-element poppins"
                    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                    date={item.dates}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    key={i}
                >
                    <h3 className="vertical-timeline-element-title">{item.name}</h3>
                    <h4 className="vertical-timeline-element-subtitle">{item.subtitle}</h4>
                    <SlideDown closed={!open[i]}>
                        <p>{item.desc}</p>
                    </SlideDown>
                    <div role="button" tabindex="0" onClick={e => flipOpen(i)} onKeyDown={e => { if (e.keyCode === 13) {flipOpen(i)}}} className={"btn"}>Click to read more</div>
                </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
    )
}