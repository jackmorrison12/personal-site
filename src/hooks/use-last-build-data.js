import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const useLastBuildData = () => {
  const data = useStaticQuery(graphql`
    {
      main: dataYaml(last_build: { gt: 1 }) {
        last_build
      }
    }
  `)
  return data.main.last_build
}

export default useLastBuildData
