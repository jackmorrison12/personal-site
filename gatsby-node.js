/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */

const path = require(`path`)
const _ = require("lodash")

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
  {
    fromPath: "/projects/personal-site",
    toPath: "/index",
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
      var seriesNodes = getNodesByType(`MarkdownRemark`)
      seriesNodes = seriesNodes.filter(innernode => {
        return (
          innernode.frontmatter &&
          innernode.frontmatter.type &&
          innernode.frontmatter.type === "series" &&
          innernode.frontmatter.slug === node.frontmatter.blogseries
        )
      })
      node.frontmatter.hero = !node.frontmatter.hero
        ? seriesNodes[0].frontmatter.hero
        : node.frontmatter.hero
      node.frontmatter.logo = !node.frontmatter.logo
        ? seriesNodes[0].frontmatter.logo
        : node.frontmatter.logo
      node.frontmatter.series = seriesNodes[0].frontmatter.title
      node.frontmatter.hidden =
        node.frontmatter.hidden || seriesNodes[0].frontmatter.hidden
      var blogNodes = getNodesByType(`MarkdownRemark`)
      blogNodes = blogNodes.filter(innernode => {
        return (
          innernode.frontmatter &&
          innernode.frontmatter.type &&
          innernode.frontmatter.type === "blog" &&
          innernode.frontmatter.blogseries === node.frontmatter.blogseries &&
          !innernode.frontmatter.hidden
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
      blogNodes.sort(compare)
      node.frontmatter.totalentries = blogNodes.length
      node.frontmatter.entry =
        blogNodes.findIndex(x => x.frontmatter.slug === node.frontmatter.slug) +
        1
    } else if (node.frontmatter.type === "series") {
      node.frontmatter.fullurl = node.frontmatter.baseurl.concat(
        node.frontmatter.slug
      )
      var blogNodes = getNodesByType(`MarkdownRemark`)
      blogNodes = blogNodes.filter(innernode => {
        return (
          innernode.frontmatter &&
          innernode.frontmatter.type &&
          innernode.frontmatter.type === "blog" &&
          innernode.frontmatter.blogseries === node.frontmatter.slug &&
          !innernode.frontmatter.hidden
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
      blogNodes.sort(compare)
      if (blogNodes.length > 1) {
        node.frontmatter.startdate = blogNodes[0].frontmatter.date
        node.frontmatter.enddate =
          blogNodes[blogNodes.length - 1].frontmatter.date
        node.frontmatter.date = blogNodes[blogNodes.length - 1].frontmatter.date
      } else if (blogNodes.length === 1) {
        node.frontmatter.startdate = blogNodes[0].frontmatter.date
        node.frontmatter.enddate = blogNodes[0].frontmatter.date
        node.frontmatter.date = blogNodes[blogNodes.length - 1].frontmatter.date
      } else {
        node.frontmatter.startdate = node.frontmatter.date
        node.frontmatter.enddate = node.frontmatter.date
      }
      node.frontmatter.totalposts = blogNodes.length
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
  const tagTemplate = path.resolve("src/templates/tag.js")

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
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
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
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

  const posts = result.data.postsRemark.edges

  posts.forEach(({ node }) => {
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

  const tags = result.data.tagsGroup.group

  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}
