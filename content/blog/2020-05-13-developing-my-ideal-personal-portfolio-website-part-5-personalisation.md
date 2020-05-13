---
title: "Developing my Ideal Personal Portfolio Website - Part 5: Personalisation!"
slug: /blog/portfolio-personalisation
date: 2020-05-13T23:44:04.965Z
hidden: false
description: The fifth iteration of my personal portfolio series
topics:
  - Personalisation
---
The next stage of creating the site: adding content! 

## What is a CMS

A [Content Management System (CMS)](https://en.wikipedia.org/wiki/Content_management_system) allows the content of a site to be separated from the implementation. I decided to use Netlify CMS with my site.

## Choosing Content for CMS

Firstly, as I mentioned last time, I needed to choose which content to integrate with my CMS. To start off, I added the main content areas which I knew would be updated most frequently: projects, articles and blog posts. I chose to separate articles from blog posts since I wanted to get into writing a lot more frequently, and therefore I could have more informal blog posts, with key articles about things I found much more interesting. 

## Writing the Content

Since I had previous iterations of my site, I sourced the majority of the content from these. This included the page content, as well as metadata such as sources, tech used and dates. I then populated all of this into the CMS, which saves it as markdown files in my git repo.

## Displaying the Content

To display the content on my site, I used GraphQL queries to get the files from the markdown files. [GraphQL](https://graphql.org/) is a query language which is integrated into Gatsby. It allows queries to be executed when the site is built, which is a key to why Gatsby is so fast. An example of a query is this:

```
query BlogRollQuery {
  allMarkdownRemark(
    sort: { order: DESC, fields: [frontmatter___date] }
    filter: {
      fileAbsolutePath: {regex: "/blog/"  }
      frontmatter: {hidden: {eq: false}}
    }
  ) {
    edges {
      node {
        excerpt(pruneLength: 300)
        id
        frontmatter {
          slug
          title
          date(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
}
```

This fetches the data needed to show a summary of all of my blog posts on my site. It only requests the data needed, and all of this is accessible in the JSX file.
You can set the props to be this data, like this:

```
BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};
```

Then for simplicity I rename some things:

```
const { data } = this.props;
const { edges: posts } = data.allMarkdownRemark;
```

Finally I can access the stuff I need in my component by writing the code `{post.frontmatter.title}`. Easy!

## Next time

The next thing I want to do is personalise my site! I'm going to look at adding some content to the 'About Me' page.
