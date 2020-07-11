import React from "react"
import useStatsData from "../../hooks/use-stats-data"
import ReactTooltip from "react-tooltip"
import { Twemoji } from "react-emoji-render"
import TimeAgo from "react-timeago"
import { OutboundLink } from "gatsby-plugin-google-analytics"

export default props => {
  const data = useStatsData()
  const main_data = data.header.SUM
  const language_data = data.languages
  let colours = [
    ["pink", "white"],
    ["green", "white"],
    ["medium-blue", "white"],
    ["yellow", "black"],
    ["cyan", "black"],
  ]
  var other_lines = main_data.code
  var other_files = main_data.nFiles
  for (const property in language_data) {
    other_lines -= language_data[property].code
    other_files -= language_data[property].nFiles
  }
  return (
    <>
      <h2>
        This website consists of{" "}
        <span className="is-red">{main_data.code}</span> lines of code over{" "}
        <span className="is-red">{main_data.nFiles}</span> files.
      </h2>
      <h2>
        It's mainly written with{" "}
        <span className="is-red">{Object.keys(language_data).length}</span>{" "}
        languages:{" "}
        {Object.entries(language_data)
          .map((item, i) => (
            <span className={"is-" + colours[i][0]}>{item[0]}</span>
          ))
          .reduce((acc, curr, i) =>
            i !== 0
              ? [
                  acc,
                  `${
                    Object.entries(language_data).length - 1 === i
                      ? ` and  `
                      : ", "
                  }`,
                  curr,
                ]
              : curr
          )}
        .
      </h2>
      <div className="bar">
        {Object.entries(language_data).map((item, i) => {
          return (
            <section
              style={{ width: (item[1].code / main_data.code) * 100 + "%" }}
              className={
                "is-" +
                colours[i][0] +
                "-bg-always is-" +
                colours[i][1] +
                "-always"
              }
            >
              <p
                className="margin-0 mobile-hide"
                data-tip={
                  item[1].name +
                  ": " +
                  item[1].code +
                  " lines in " +
                  item[1].nFiles +
                  " files"
                }
              >
                {item[1].name}
              </p>
            </section>
          )
        })}
        <section
          style={{ width: (other_lines / main_data.code) * 100 + "%" }}
          className={
            "is-" +
            colours[Object.keys(language_data).length][0] +
            "-bg-always is-" +
            colours[Object.keys(language_data).length][1] +
            "-always"
          }
        >
          <p
            className="margin-0 mobile-hide"
            data-tip={
              "Other: " + other_lines + " lines in " + other_files + " files"
            }
          >
            {"..."}
          </p>
        </section>
      </div>
      <div className="pad-3-t mobile-show">
        {Object.entries(language_data).map((item, i) => {
          return (
            <div className="">
              <span
                className={"dot is-" + colours[i][0] + "-bg-always margin-3-r"}
              ></span>
              <span>
                {item[1].name} - {item[1].code} lines in {item[1].nFiles} files
              </span>
            </div>
          )
        })}
        <div className="">
          <span
            className={
              "dot is-" +
              colours[Object.keys(language_data).length][0] +
              "-bg-always margin-3-r"
            }
          ></span>
          <span>
            Other - {other_lines} lines in {other_files} files
          </span>
        </div>
      </div>
      <p>
        <Twemoji svg text="💻 Data sourced using " />
        <OutboundLink className="link" href="https://github.com/boyter/scc/">
          scc terminal command
        </OutboundLink>
        , accurate as of last build (<TimeAgo date={props.last_build} />)
      </p>
      <p className="credit">
      <Twemoji svg text="💡 Idea inspired by " />
        <OutboundLink className="link" href="https://sld.codes/stats">
          sld.codes
        </OutboundLink>
      </p>
      <ReactTooltip />
    </>
  )
}
