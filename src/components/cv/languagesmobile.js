import React from "react"

export default props => {
  return (
    <>
      <h3 className="is-green-always subtitle">Technical Experience</h3>
      {props.languages.nodes.map(item => (
        <div className="margin-3-t">
          <h4 className="margin-0-b">{item.name}</h4>
          <div className="row pad-2-t">
            <p>
              {item.languages
                .map(lang => lang.name)
                .reduce((acc, curr, i) =>
                  i !== 0
                    ? [
                        acc,
                        `${
                          Object.entries(item.languages).length - 1 === i
                            ? ` &  `
                            : ", "
                        }`,
                        curr,
                      ]
                    : curr
                )}
            </p>
          </div>
        </div>
      ))}
    </>
  )
}
