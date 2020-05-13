import React from "react"
import pythonData from "../../data/legacy/python.json"

export default () => (
    <>
        <div className="col-xs-12 col-md-6 pad-0">
            <h1>Teaching</h1>
            <p>
                I enjoy teaching, and have volunteered my skills teaching a Robotics Club at <a href="http://www.netley.camden.sch.uk/" className="is-medium-blue btn">Netley Primary School</a>, as well as for an introductory Python Course at <a href="https://www.cooperscoborn.org.uk/" className="is-medium-blue btn">The Coopers' Company and Coborn School</a>.
                <br /><br />
                The course I taught at Coopers is completely open source, and the lesson plans and resources can be found below. Please feel free to use them and contribute any ideas!
            </p>
        </div>
        <div className="col-xs-12 col-md-12 pad-0"> 
            <table class="teaching-table-desktop text-align-center">
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
                    return(
                        <tr>
                            <td>{item.name}</td>
                            <td><a href ={item.teacher_slides}>Teacher Slides {i+1}</a></td>
                            <td><a href ={item.student_slides}>Student Slides {i+1}</a></td>
                            <td><a href ={item.worksheet}>Worksheet {i+1}</a></td>
                            <td><a href ={item.answers}>Worksheet Answers {i+1}</a></td>
                            {item.notebook ? <td><a href ={item.notebook}>Jupyter Notebook {i+1}</a></td> : <td class="teaching-table-empty"></td>}
                            {item.leaderboard ? <td><a href ={item.leaderboard}>Leaderboard {i+1}</a></td> : <td class="teaching-table-empty"></td>}
                            {item.kahoot ? <td><a href ={item.kahoot}>Kahoot {i+1}</a></td> : <td class="teaching-table-empty"></td>}
                            <td><a href ={item.github} className="icon">Source {i+1}</a></td>
                        </tr>
                    );
                })}

            </table>
            <div class="teaching-table-mobile">
                {pythonData.map((item, i) => {
                    return(
                        <>
                            <h4>Week {i+1} - {item.name}</h4>
                            <p><a href ={item.teacher_slides}>Teacher Slides</a></p>
                            <p><a href ={item.student_slides}>Student Slides</a></p>
                            <p><a href ={item.worksheet}>Worksheet</a></p>
                            <p><a href ={item.answers}>Worksheet Answers</a></p>
                            {item.notebook ? <><p><a href ={item.notebook}>Jupyter Notebook</a></p></> : ""}
                            {item.leaderboard ? <><p><a href ={item.leaderboard}>Leaderboard</a></p></> : ""}
                            {item.kahoot ? <><p><a href ={item.kahoot}>Kahoot</a></p></> : ""}
                            <p><a href ={item.github}>Source Code</a></p>
                        </>                                   
                        );
                })}

            </div>
        </div>
    </>
)