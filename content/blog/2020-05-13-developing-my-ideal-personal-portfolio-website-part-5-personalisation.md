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

Once I created the header, I moved on to how I would display the content. I didn't want a cluttered design, but I also didn't want to have to create a separate page for all of the content I listed above. I decided that I'd try to meet in the middle - I'd give a highlight of everything in a short paragraph (max 50 words), and then link the keywords to show a component with more detailed information in. This means that people can click more if they'd like to know more, and don't have to sift through a load of useless information they don't want to read.

To show the content, I had to make use of state hooks to keep track of which section the user had clicked on, and make sure the corresponding React component was displayed.

### Libraries Used

For the Education and Experience sections, I decided to bite the bullet and connect these to the Netlify CMS. I also did my projects at the same time. I knew this would take a while, but eventually it would mean I could update them a lot easier. I decided to use [`react-vertical-timeline-component`](https://www.npmjs.com/package/react-vertical-timeline-component). This allowed me to display the information in a nice format with minimal effort. I also wanted to collapse more detailed information here, in case someone was looking for a brief overview. I did this using a state hook as I did for the components above.

I also used [`react-audio-player`](https://www.npmjs.com/package/react-audio-player) on my music creation page, in order to sample some of the songs I'd made. I chose this because I could link songs from external sources, so in this case I used the git repo I had with my music backed up into, since this saved copying them into the repo. 

The final thing I wanted to include was a map of places I've travelled. I stared off my using one by [amCharts](https://www.amcharts.com/), however, it was tripling my build time, so I'm currently searching for an alternative.

## Possible Improvements

One thing I'd like to be able to do is link to each of the sections independently using a different URL, for example by appending `#experience` to the end. This is something I want to look into in the future.

## What next?

Well the next thing any professional portfolio needs is a link to your CV! However, I wanted to put my React skills to the test and code my own.