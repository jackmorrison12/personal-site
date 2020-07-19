---
type: blog
baseurl: "/blog/"
series: Developing My Ideal Personal Portfolio Website
blogseries: portfolio
entry: 6
title: Coding a CV in React
slug: cv
date: 2020-05-18T01:41:44.394Z
hidden: false
description: "A guide on how I created my current CV, which integrates directly into my site!"
topics:
  - CV
---

Everyone has a CV, and I've had many iterations over the years. Most recently, I'd been using [FlowCV](https://flowcv.io/) to build mine. This was working really well, however it was a pain to update. Every time I changed something, I had to log in, change the details, check the layout still worked and fix if needed, download the PDF, then upload this to my site and rebuild. It was a long process, and I wanted to streamline it. I already had basically all of the content for my CV on my site, so I thought, why not use it?

## Where to start

I was simultaneously excited and nervous to start this part of my site. I knew it was something which would look really good, but I also wasn't sure how well I could execute it. I started off by looking around and seeing if there were any examples online. I couldn't find any tutorials which covered what I wanted to create, but found [a great example](https://sld.codes/cv) of another CV created using React, so I knew it was possible.

## Structure

The first thing I did was to create the base of the CV. I did this by creating a class called `cv`, which would be on a div which enclosed my whole CV. In this class, I would add all of the relevant SASS for styling, so it would not affect the rest of the site.

I added things like a different font, an always white background, and the dimensions to make it the same size as A4 paper (210x290mm).

The next thing I had to do was to think about the layout. Just because I created a new class to encompass all of my SASS, didn't mean I couldn't use existing stylings I already had, including the grid system I use on my site. It follows the [Bootstrap Grid System](https://getbootstrap.com/docs/4.1/layout/grid/), and allows me to responsively layout content with ease. I used this to create two columns, which were split into different content sections.

## Content

The next stage was to add the content! I had the majority of things on y existing CV already present somewhere in my codebase, so I created a GraphQL query to gather all of this into a single response, so I could display it as I wanted. Any information which wasn't present I just added to the relevant file. I had considered using the [JSON Resume](https://jsonresume.org/) format, which is an open source initiative to create a JSON-based standard for resumes, however I realised this would require lots of duplication of information. In the future, I may automatically generate a JSON file which fits this format, that can be downloaded from my site and used elsewhere.

The next thing I did was create a React component for each of the six sections of my CV: **Title**, **Education**, **Technical Experience**, **Skills**, **Experience** and **Projects**. I passed the relevant information from the GraphQL query to each component, and then structured it inside.

## Downloading my CV

Now I had my CV displaying on my site - cool! However, what if someone wanted to download? It also didn't work very well on mobiles since the screen was so small, and so I wanted to make it available to download as a PDF. Luckily, I'd read an [article](https://blog.usejournal.com/lets-make-a-resume-in-react-2c9c5540f51a) about a library called [Kendo React PDF](https://www.telerik.com/kendo-react-ui/components/pdfprocessing/), which allows you to export React components as PDFs. I decided to look into the documentation before following their tutorial, and found out there were two main ways of exporting content - either create it all in a `PDFExport` component and export this, or use a method called `savePDF` and export any component. Since I already had a master div which contained the whole CV, I chose the latter option (it also, in my opinion, gave the final page cleaner and more easy-to-understand code, which is always good).

Once I implemented this, I then made a few adjustments to make sure the CV was hidden on smaller devices, and voila... my CV page is complete!

## The last steps

Now that my CV is complete, the last thing to do is to add some finishing touched, and then make the site live, which is what I'll talk about next time!
