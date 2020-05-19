import React from "react"
import useStatsData from "../../hooks/use-stats-data"
import ReactTooltip from "react-tooltip"
import Emoji from "a11y-react-emoji"

export default () => {
  const data = useStatsData()
  const main_data = data.header.header
  const language_data = data.languages
  let colours = [
    ["pink", "white"],
    ["green", "white"],
    ["medium-blue", "white"],
    ["yellow", "black"],
    ["cyan", "black"],
  ]
  console.log(data)
  return (
    <>
      <h2>
        This website consists of{" "}
        <span className="is-red">{main_data.n_files}</span> files and{" "}
        <span className="is-red">{main_data.n_lines}</span> lines of code.
      </h2>
      <h2>
        This website it mainly written with{" "}
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
              style={{ width: (item[1].code / main_data.n_lines) * 100 + "%" }}
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
      </div>
      <p>
        <Emoji symbol="💻" label="laptop" /> Data sourced using scc terminal
        command
      </p>
      <ReactTooltip />
    </>
  )
}
