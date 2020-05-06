/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);

exports.createPages = async ({actions, graphql, reporter}) => {
  const {createPage} = actions;

  const blogPostTemplate = path.resolve(`src/templates/blog.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000, filter: {fileAbsolutePath: {regex: "/blog/"  }}
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
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    createPage({
      path: node.frontmatter.slug,
      component: blogPostTemplate,
      context: {}, // additional data can be passed via context
    })
  })
};

exports.createPages = async ({actions, graphql, reporter}) => {
    const {createPage} = actions;
  
    const articleTemplate = path.resolve(`src/templates/article.js`);
  
    const result = await graphql(`
      {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          limit: 1000, filter: {fileAbsolutePath: {regex: "/articles/"  }}
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
    `);
  
    // Handle errors
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`);
      return
    }
  
    result.data.allMarkdownRemark.edges.forEach(({node}) => {
      createPage({
        path: node.frontmatter.slug,
        component: articleTemplate,
        context: {}, // additional data can be passed via context
      })
    })
  };