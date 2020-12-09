---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Rack-Scale Computing
slug: rack-scale-computing
topic: 7.4
hidden: false
tags:
  - Rack-Scale Computing
---

## What is a Rack?

A rack is the unit of deployment in a data centre

It's the sweet spot between a single server and cluster deployments

It has 42 units that host the compute resources

A rack-scale computer comes pre packages - it has the abilities of:

- Compute
  - Standard compute (multicore servers)
  - Accelerators (GPUs)
- Storage
  - Hot/warm/cold disks
  - Non-volatile/SSDs
- Networking
  - Interconnect
  Software defined networking, so they have flexibility in what the interconnection topology is

## Server-Centric to Resource-Centric Design

Server centric design is where each server comes with specific resources, such as CPUs and GPUs, and all of these connect to the data centre network

Resource centric design is where each server has a specific resource, e.g. just CPUs or GPUs

This means we can combine resources which make sense for the workload on demand, as we have resource disaggregation

