---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: SSD
slug: ssd
topic: 2.1
hidden: false
tags:
  - SSD
---

# What is an SSD?

<div class="def">
  <span class="is-primary bold">SSD: </span>Solid State Drive
</div>

SSDs are not a drop in replacement for disk, they have different purposes

They can be used as <mark>secondary storage</mark> or as a <mark>caching layer</mark>

Their main advantage over disks are that <mark>random reads and sequential reads have roughly the same speed</mark>

However, they do have <mark>slow random writes</mark>

Data is still organised in <mark>pages</mark>, and pages are organised in flash blocks

There is a limit to the number of times an SSD can be written to - if you use it for heavy write workloads this can be a problem

Similarly to RAM, the <mark>time</mark> to retrieve a disk page is <mark>not related to the location on the disk</mark>

# What's inside an SSD?

Date enters through an interface (e.g. SATA), and into the internal CPU

There is a flash controller, which manages where in the flash disk the data is stored

Inside of a flash package, we have dies, inside of these we have planes, inside of these we have blocks and finally inside of these are pages

There are no moving parts, so not many mechanical limitations, and the time to access data doesn't depend on location

The software driver (flash controller) is pretty complex - it places the data on disk and keeps track of how many times each block has been written to, in order to spread this out so that app flash pages degrade at the same pace (wear levelling)

## Accessing a flash page

The time to access a flash page depends on:

- Device organisation (internal parallelism)
- Software efficiency (driver)
- Bandwidth of flash packages
- How many requests there are

The flash translation layer is the complex device driver, and it services read/write requests, and tunes the performance and device lifetime, as stated earlier

# SSD vs HDD

| HDD                      	| SSD                         	|
|--------------------------	|-----------------------------	|
| Large                    	| Small                       	|
| Inexpensive capacity     	| Expensive capacity          	|
| Inefficient random reads 	| Very efficient random reads 	|

