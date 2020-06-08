import React from "react"
import { Twemoji } from "react-emoji-render"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import pythonData from "../../data/python.json"

export default () => (
  <>
    <div className="col-xs-12 col-md-6">
      <h1>
        <Twemoji svg text="👨‍🏫 Teaching" />
      </h1>
      <p>
        I enjoy teaching, and have volunteered my skills teaching a Robotics
        Club at{" "}
        <OutboundLink
          href="http://www.netley.camden.sch.uk/"
          className="is-medium-blue link"
        >
          Netley Primary School
        </OutboundLink>
        , as well as for an introductory Python Course at{" "}
        <OutboundLink
          href="https://www.cooperscoborn.org.uk/"
          className="is-medium-blue link"
        >
          The Coopers' Company and Coborn School
        </OutboundLink>
        .
      </p>
      <p>
        The course I taught at Coopers is completely open source, and the lesson
        plans and resources can be found below. Please feel free to use them and
        contribute any ideas!
      </p>
    </div>
    <div className="col-xs-12">
      <table className="teaching-table-desktop text-align-center">
        <tr>
          <th>Week</th>
          <th>Teacher Slides</th>
          <th>Student Slides</th>
          <th>Worksheet</th>
          <th>Worksheet Answers</th>
          <th>Jupyter Notebook</th>
          <th>Leaderboard</th>
          <th>Kahoot</th>
          <th>GitHub</th>
        </tr>
        {pythonData.map((item, i) => {
          return (
            <tr>
              <td>{item.name}</td>
              <td>
                <OutboundLink href={item.teacher_slides}>
                  Teacher Slides {i + 1}
                </OutboundLink>
              </td>
              <td>
                <OutboundLink href={item.student_slides}>
                  Student Slides {i + 1}
                </OutboundLink>
              </td>
              <td>
                <OutboundLink href={item.worksheet}>
                  Worksheet {i + 1}
                </OutboundLink>
              </td>
              <td>
                <OutboundLink href={item.answers}>
                  Worksheet Answers {i + 1}
                </OutboundLink>
              </td>
              {item.notebook ? (
                <td>
                  <OutboundLink href={item.notebook}>
                    Jupyter Notebook {i + 1}
                  </OutboundLink>
                </td>
              ) : (
                <td className="teaching-table-empty"></td>
              )}
              {item.leaderboard ? (
                <td>
                  <OutboundLink href={item.leaderboard}>
                    Leaderboard {i + 1}
                  </OutboundLink>
                </td>
              ) : (
                <td className="teaching-table-empty"></td>
              )}
              {item.kahoot ? (
                <td>
                  <OutboundLink href={item.kahoot}>Kahoot {i + 1}</OutboundLink>
                </td>
              ) : (
                <td className="teaching-table-empty"></td>
              )}
              <td>
                <OutboundLink href={item.github} className="icon">
                  Source {i + 1}
                </OutboundLink>
              </td>
            </tr>
          )
        })}
      </table>
      <div className="teaching-table-mobile">
        {pythonData.map((item, i) => {
          return (
            <>
              <h4>
                Week {i + 1} - {item.name}
              </h4>
              <p>
                <OutboundLink href={item.teacher_slides}>
                  Teacher Slides
                </OutboundLink>
              </p>
              <p>
                <OutboundLink href={item.student_slides}>
                  Student Slides
                </OutboundLink>
              </p>
              <p>
                <OutboundLink href={item.worksheet}>Worksheet</OutboundLink>
              </p>
              <p>
                <OutboundLink href={item.answers}>
                  Worksheet Answers
                </OutboundLink>
              </p>
              {item.notebook ? (
                <>
                  <p>
                    <OutboundLink href={item.notebook}>
                      Jupyter Notebook
                    </OutboundLink>
                  </p>
                </>
              ) : (
                ""
              )}
              {item.leaderboard ? (
                <>
                  <p>
                    <OutboundLink href={item.leaderboard}>
                      Leaderboard
                    </OutboundLink>
                  </p>
                </>
              ) : (
                ""
              )}
              {item.kahoot ? (
                <>
                  <p>
                    <OutboundLink href={item.kahoot}>Kahoot</OutboundLink>
                  </p>
                </>
              ) : (
                ""
              )}
              <p>
                <OutboundLink href={item.github}>Source Code</OutboundLink>
              </p>
            </>
          )
        })}
      </div>
    </div>
  </>
)
