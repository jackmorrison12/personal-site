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
  {
    fromPath: "/about",
    toPath: "/me",
    isPermanent: true,
  },
]
exports.onCreateNode = ({ node, getNodesByType }) => {
  if (node.frontmatter && node.frontmatter.type) {
    if (node.frontmatter.type === "blog") {
      node.frontmatter.fullurl = node.frontmatter.baseurl.concat(
        node.frontmatter.blogseries,
        "/",
        node.frontmatter.slug
      )
    } else if (node.frontmatter.type === "series") {
      node.frontmatter.fullurl = node.frontmatter.baseurl.concat(
        node.frontmatter.slug
      )
      var allNodes = getNodesByType(`MarkdownRemark`)
      allNodes = allNodes.filter(innernode => {
        return (
          innernode.frontmatter &&
          innernode.frontmatter.type &&
          innernode.frontmatter.type === "blog" &&
          innernode.frontmatter.blogseries === node.frontmatter.slug
        )
      })
      function compare(a, b) {
        if (a.frontmatter.date < b.frontmatter.date) {
          return -1
        }
        if (a.frontmatter.date > b.frontmatter.date) {
          return 1
        }
        return 0
      }
      allNodes.sort(compare)
      if (allNodes.length > 1) {
        node.frontmatter.startdate = allNodes[0].frontmatter.date
        node.frontmatter.enddate =
          allNodes[allNodes.length - 1].frontmatter.date
      } else if (allNodes.length === 1) {
        node.frontmatter.startdate = allNodes[0].frontmatter.date
        node.frontmatter.enddate = allNodes[0].frontmatter.date
      } else {
        node.frontmatter.startdate = node.frontmatter.date
        node.frontmatter.enddate = node.frontmatter.date
      }
      node.frontmatter.totalposts = allNodes.length
    } else if (node.frontmatter.type === "article") {
      node.frontmatter.fullurl = node.frontmatter.baseurl.concat(
        node.frontmatter.slug
      )
    } else if (node.frontmatter.type === "project") {
      node.frontmatter.fullurl = node.frontmatter.baseurl.concat(
        node.frontmatter.slug
      )
    }
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions

  const blogPostTemplate = path.resolve(`src/templates/blog.js`)
  const articleTemplate = path.resolve(`src/templates/article.js`)
  const projectTemplate = path.resolve(`src/templates/project.js`)
  const seriesTemplate = path.resolve(`src/templates/series.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        filter: {
          frontmatter: { type: { regex: "/blog|project|article|series/" } }
        }
      ) {
        edges {
          node {
            frontmatter {
              slug
              type
              baseurl
              blogseries
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
      path:
        node.frontmatter.type === "blog"
          ? node.frontmatter.baseurl.concat(
              node.frontmatter.blogseries,
              "/",
              node.frontmatter.slug
            )
          : node.frontmatter.baseurl.concat(node.frontmatter.slug),
      component:
        node.frontmatter.type === "blog"
          ? blogPostTemplate
          : node.frontmatter.type === "article"
          ? articleTemplate
          : node.frontmatter.type === "project"
          ? projectTemplate
          : seriesTemplate,
      context: {
        blogseries: node.frontmatter.blogseries,
        baseurl: node.frontmatter.baseurl,
        slug: node.frontmatter.slug,
      }, // additional data can be passed via context
    })
  })
}
