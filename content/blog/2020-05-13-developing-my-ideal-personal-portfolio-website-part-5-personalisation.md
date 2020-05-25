---
title: "Developing my Ideal Personal Portfolio Website - Part 5: Personalisation!"
slug: /blog/portfolio-personalisation
date: 2020-05-13T23:44:04.965Z
hidden: false
description: The fifth iteration of my personal portfolio series
topics:
  - Personalisation
---
The point of making this site was to make it a place to store information about myself. Whether it be for myself, as an easy reference place to look up things I've done, or a place where others can learn more about me, I want it to feel like something I've made. This led to the next step - personalisation. More specifically, adding the "About Me" page.

## Content

The first thing I wanted to do was have an idea of what I wanted to write about. I knew I'd include the obvious Education and Experience sections, but I also wanted to add some different things. I enjoy teaching, especially, so I wanted to add a section on this. I also have been dabbling in music production, so thought I could have a place to share some of the stuff I've made. I then wanted to add some of my hobbies such as travelling and skydiving.

## Design

### Header

I wanted to make the page feel like it was made by me, but also look professional. I decided I wanted a header at the top which contained some pictures of me with friends and doing things I enjoy. I initially toyed with the idea of linking it to my Instagram account, however I thought that this could result in having a lot of similar images if I posted multiple from the same event, and it was harder to check they worked well together. I also wanted to use `gatsby-image` so that the pictures were optimised. This is much harder when using the Instagram API, as `gatsby-image` doesn't allow external image URLs, so I'd have to download them, which is not something I wanted to set up. However, it's a potential future idea. 

### Displaying Content

Once I created the header, I moved on to how I would display the content. 