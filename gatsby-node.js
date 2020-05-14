/**
 * This file is based on code from https://developer.okta.com/blog/2020/02/18/gatsby-react-netlify
 */


const path = require(`path`);

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /bad-module/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

exports.createPages = async ({actions, graphql, reporter}) => {
  const {createPage} = actions;

  const blogPostTemplate = path.resolve(`src/templates/blog.js`);
  const articleTemplate = path.resolve(`src/templates/article.js`);
  const projectTemplate = path.resolve(`src/templates/project.js`);


  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
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
      component: (node.frontmatter.slug.includes("/blog/") ? blogPostTemplate : (node.frontmatter.slug.includes("/articles/") ? articleTemplate : projectTemplate)),
      context: {}, // additional data can be passed via context
    })
  })
};
