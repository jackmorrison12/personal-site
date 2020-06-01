---
title: Canvas
slug: /projects/canvas
type: Uni Project
homepage: true
cv: true
featured: true
hidden: false
hero: /img/canvas-logo.png
description: A CRDT-powered collaborative drawing app
tech:
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
  - highlight: Used a mesh network topology to allow for decentralisation
---

<div class="row">
  <div class="col-xs-12">
    <p>
We've noticed a trend: over the last few years, everything is becoming more collaborative.

But one thing is lagging behind... drawing tools.

That is, until now.

</p>

  </div>
  <div class="col-xs-12">
    <p>

We have created a resilient collaborative drawing app for iPadOS, using _Conflict-free Replicated Data Types_, or <span class="is-red">CRDTs</span>.

Meet **Canvas**.

  </p>
  </div>
  
    <div class="col-xs-12 col-sm-6">

![Canvas Features](/img/canvas-1.png "Canvas Features")

  </div>
  <div class="col-xs-12 col-sm-6 flex"  style="justify-content:center; flex-direction:column">
    <p>

It has everything you'd expect, plus advanced whiteboard features, such as shape and line recognition.

  </p>
  </div>
  <div class="col-xs-12 col-sm-6 flex"  style="justify-content:center; flex-direction:column">
    <p>

Canvas allows users to connect and draw at the same time, but what makes it different? It's decentralised.

It uses multiple connection mechanisms, including XMPP and Bluetooth, the create mesh networks.

  </p>
  </div>
        <div class="col-xs-12 col-sm-6">

![Canvas Network Architechture](/img/canvas-2.png "Canvas Network Architechture")

  </div>
</div>
