---
title: "Developing my Ideal Personal Portfolio Website - Part 4: Adding Content"
slug: /blog/portfolio-adding-content
date: 2020-05-08T00:01:02.535Z
hidden: false
description: The fourth iteration of my personal portfolio series
topics:
  - Adding Content
---
The next stage of creating the site: adding content! 

## What is a CMS

A [Content Management System (CMS)](https://en.wikipedia.org/wiki/Content_management_system) allows the content of a site to be separated from the implementation. I decided to use Netlify CMS with my site.

## Choosing Content for CMS

Firstly, as I mentioned last time, I needed to choose which content to integrate with my CMS. To start off, I added the main content areas which I knew would be updated most frequently: projects, articles and blog posts. I chose to separate articles from blog posts since I wanted to get into writing a lot more frequently, and therefore I could have more informal blog posts, with key articles about things I found much more interesting. 

## Writing the Content

Since I had previous iterations of my site, I sourced the majority of the content from these. This included the page content, as well as metadata such as sources, tech used and dates. I then populated all of this into the CMS, which saves it as markdown files in my git repo.

## Displaying the Content

To display the content on my site, I used GraphQL queries to get the files from the markdown files. 