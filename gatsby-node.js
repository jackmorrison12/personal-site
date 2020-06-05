/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

const path = require(`path`)

const redirects = [
  {
    fromPath: "/music",
    toPath: "/me#music",
    isPermanent: true,
  },
  {
    fromPath: "/python",
    toPath: "/me#teaching",
    isPermanent: true,
  },
  {
    fromPath: "/projects/python",
    toPath: "/me#teaching",
    isPermanent: true,
  },
  {
    fromPath: "/projects/musictech",
    toPath: "/me#music",
    isPermanent: true,
  },
  {
    fromPath: "/education",
    toPath: "/me#education",
    isPermanent: true,
  },
  {
    fromPath: "/experience",
    toPath: "/me#experience",
    isPermanent: true,
  },
  {
    fromPath: "/files/jack-cv.pdf",
    toPath: "/cv",
    isPermanent: true,
  },
]

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions

  const blogPostTemplate = path.resolve(`src/templates/blog.js`)
  const articleTemplate = path.resolve(`src/templates/article.js`)
  const projectTemplate = path.resolve(`src/templates/project.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: { fileAbsolutePath: { regex: "/blog/|/projects/|/articles/" } }
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  redirects.forEach(redirect => createRedirect(redirect))

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: node.frontmatter.slug.includes("/blog/")
        ? blogPostTemplate
        : node.frontmatter.slug.includes("/articles/")
        ? articleTemplate
        : projectTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}
