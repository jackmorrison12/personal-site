---
type: project
baseurl: "/projects/"
title: Canvas
slug: canvas
projecttype: Uni Project
homepage: true
cv: true
featured: true
hidden: false
hero: /img/canvas-logo.png
banner: /img/canvas-banner.png
description: A CRDT-powered collaborative drawing app
tags:
  - Swift
  - XCode
  - CRDTs
startdate: 2019-09-30T23:00:00.000Z
enddate: 2020-01-01T00:00:00.000Z
sources:
  - name: GitHub
    url: https://github.com/mnckapilan/crdt-canvas
    icon: fab fa-github
highlights:
  - highlight: Created a collaborative drawing whiteboard application for iOS
  - highlight: Researched Conflict-free Replicated Data Types (CRDTs)
  - highlight: Used a mesh network topology consisting of local Bluetooth connections and a global XMPP server to allow for decentralisation
  - highlight: Created a public protocol to interoperate with other whiteboard applications, including one created by other students
---

<div class="intro">

We've noticed a trend: over the last few years, everything is becoming more collaborative

But one thing is lagging behind... _drawing tools_

That is, until now

Introducing... <span class="highlight">Canvas</span>

</div>

<div class="row">
  <div class="left">

## What is canvas?

We have created a resilient collaborative drawing app for iPadOS, using _Conflict-free Replicated Data Types_, or <span class="highlight">CRDTs</span>

  </div>
  <div class="right">

![CRDTs- Canvas](/img/canvas-1.png "CRDTs- Canvas")

  </div>
</div>
<div class="row">
  <div class="left">

## Features

Canvas has everything you'd expect from a drawing app, such as various design tools and sharing options, plus more advanced features, such as extremely accurate\* <span class="highlight">shape and line recognition</span>

  </div>
  <div class="right">

![Features - Canvas](/img/canvas-2.png "Features - Canvas")

  </div>
</div>
<div class="row">
  <div class="left">

## Users

Canvas allows up to <span class="highlight">1000 users</span>\* to connect and draw at the same time

But what makes it different to every other online whiteboard?

It's <span class="highlight">de-centralised</span>

  </div>
  <div class="right">

![Users - Canvas](/img/canvas-3.png "Users - Canvas")

  </div>
</div>
<div class="row">
  <div class="left">

## Networking

Our app uses a dual connection mechanism, making use of an <span class="highlight">XMPP</span> server, for long-distance drawing, and a <span class="highlight">Bluetooth</span> mesh topology, for optimised close-range drawing

This creates a <span class="highlight">resilient, de-centralised\*\* network</span>

  </div>
  <div class="right">

![Networking - Canvas](/img/canvas-4.png "Networking - Canvas")

  </div>
</div>

<div class="footnote">

\*CRDTs are currently an open research area, so this project started as a proof of concept to see if they could be used in this context. We wrote a [report](/files/canvas-report.pdf) which analyses referenced statistics in much more depth.

\*\*CRDTs are a class of abstract data types that allow their state to be distributed across devices, modified locally and then merged in a straight-forward manner, meaning that they guarantee eventual consistency. Therefore, Canvas is completely de-centralised, and as such does not rely on one of the nodes to always be connected to the XMPP server.

</div>
