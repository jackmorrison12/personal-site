---
title: Canvas
slug: /projects/canvas
type: Uni Project
homepage: true
hidden: false
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
---
Remote collaboration has been increasing in popularity over the last couple of years, especially within professional working environments and academia. However, tools for visual collaboration, such as through drawing, are currently lacking, with many suffering from lag, dropped connections or devices not syncing together correctly. 

We have created a resilient collaborative drawing app for iPadOS, using Conflict-free Replicated Data Types (CRDTs), that aims to prevent failures as listed previously from becoming an issue.

Our app, which is optimised for iPads, is called Canvas. Canvas allows users to connect and draw at the same time. Changes are propagated in real time, so if a user becomes temporarily disconnected, on reconnection, the changes that they made during this period will sync up. Canvas offers features such as shape recognition and bluetooth network optimisation.

CRDTs are a class of abstract data types that allow their state to be distributed across devices, modified locally and then merged in a straight-forward manner, meaning that they guarantee eventual consistency. Therefore, Canvas is completely de-centralised, so does not rely on one of the nodes to always be connected. CRDTs are currently an open research area, so this project started as a proof of concept to show that they could be used in this context. 

Since this was an iPadOS app, we created it in XCode, using Swift 5.