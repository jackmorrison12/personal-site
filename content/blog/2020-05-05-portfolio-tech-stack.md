---
type: blog
series: Developing My Ideal Personal Portfolio Website
blogseries: /blog/portfolio
entry: 2
title: Choosing my Tech Stack
slug: /blog/portfolio/tech-stack
date: 2020-05-05T20:00:00.000Z
hidden: false
description: How I researched and decided on what technologies to create this site with
topics:
  - Personal Portfolio
  - Gatsby
  - Hugo
  - Nuxt.JS
  - Bulma
  - Tailwind
  - Netlify
---

One thing I knew for this iteration of my personal website was that I was going to research my tech stack a lot more thoroughly than I had before. There were three key areas I wanted to look into: the framework, styling and hosting.

## Framework

So I knew I wanted my site to be fast, and so I thought about using s static site generator. I've experimented with Jekyll in the past, and loved how easy it was to pick up, but always felt very limited with what I could do. I had a look around at some frameworks and came across [Hugo](https://gohugo.io/), [Gatsby](https://www.gatsbyjs.org/), [Next.js](https://nextjs.org/) and [Nuxt.js](https://nuxtjs.org/) (it took me a while to realise the latter two were actually different frameworks). After reading more into them, I knew it was between Gatsby and Hugo, since they seemed to be the most popular, and I wanted something which would have a relatively large user base and good documentation.

I ended up trolling a few [reddit threads](https://www.reddit.com/r/webdev/comments/b0j9rs/infographic_gatsby_vs_hugo_vs_jekyll/) in order to get some honest reviews, and ultimately decided on Gatsby. This was mainly because it was built on top of React, which I'm now very familiar with, and Hugo is built using Go, which I've only touched briefly. Gatsby also seemed to have more extensions and plugins, which seemed like it could be useful in my quest to not create everything from scratch.

## Styling

My next step was to find out which option would be best for styling. I'd previously only ever written CSS as I was going along, having transition to using Sass in my most recent attempt at my personal site.

I looked into a few options: [Bulma](https://bulma.io/), [Tailwind](https://tailwindcss.com/) and (of course) [Bootstrap](https://getbootstrap.com/). I'd only ever heard of the latter, and pretty quickly realised it was not what I wanted for my design ideas. I looked into more detail at Bulma and Tailwind; Bulma seemed to look very easy to use, being based on Flex, but Tailwind seemed to be much more customisable.

I then read lots of conflicting reviews in favour of each side, but I also read of a lot of people who just preferred to use sass. I found a good range of sass files which were open source, and allowed basic features like padding and colours to be implemented by just adding a class, and decided to take this route.

This was one change to how I had previously done things; I used to create a class for each item I was putting on the page, which meant that I had hundreds of lines of CSS cluttering up my repo. With this new approach, I'd have multiple classes per object, for example one to give it a colour, `is-black`, and one to give some padding `pad-10-t`.

## Hosting

With previous iterations, I've always used [GitHub Pages](https://pages.github.com/) to host my website, since it was free, integrated well, and was easy to use. However, I decided to research some alternatives. The main options I came across were [Netlify](https://www.netlify.com/), [Firebase](https://firebase.google.com/docs/hosting) and [Heroku](https://www.heroku.com/about).

I'd used Heroku before, and knew that the free tier wouldn't suffice, since their dynos can take a while to start up. I also found the documentation for Firebase was lacking in comparison to Netlify, so I ended up going with them. This also linked into the next part, the CMS.

## CMS

A content management system is a web interface you can use to populate your website. In fact, I'm using it right now to write this blog post! I thought that since I wanted to add blog posts and keep the website up-to-date with information, it would be hassle to go into the code to update things every time. That's why I decided to put any types of information which will need to be updated frequently (such as blog posts, articles and projects) into this CMS. I did look into alternatives, but since I was using Netlify to host, I decided it was best to stick in the same ecosystem since they integrated well.

## Next time...

Now that I've decided on my main tech stack, I'm going to start putting together a repo with the skeleton in, and set everything up to work together, before I get started on the main bulk of the website.
