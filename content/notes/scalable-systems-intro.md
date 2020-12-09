---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Intro to Scalable Systems
slug: scalable-systems-intro
topic: 7.1
hidden: false
tags:
  - Scalable Systems
---

# Scalable Distributed Systems

There are many examples of large distributed scalable systems

One example is Google Search, which handles around [88,000 queries per second](https://www.internetlivestats.com/one-second/#google-band)

It also has to crawl pages to index them - 50 million pages now takes less than a minute

We also need a near-instant response - the typical search query uses 1000 machines and takes 200ms

This is because performance affects revenue - at Amazon, ever 100ms of latency costs them 1% in sales

We therefore need to think about scalability

Ideally, adding 2x more serves supports 2x more users, however linear scalability is hard to achieve, due to:

- Overheads
- Synchronisation
- Load-imbalances

Therefore, we need to partition compute and data

## Supercomputers

One idea are supercomputers - this is a mainframe which has high performance, but also a h igh price tag

The advantages are:

- Simple Solution
- Powerful Hardware
- Reliable Design

However, there are also many disadvantages:

- They're EXPENSIVE (> \$1 million)
- They're hard to smoothly scale
- They're hard to upgrade
- Where do you put them? If you only have 1, then some places will have very high latency

Therefore, people moved to distributed computing

## Distributed Computing

It has a client server model

- A request is typically too large for a single server
- The problem is carefully partitioned across multiple servers

Cheap commodity hardware is used, e.g. standard local disks, to get est performance per \$

However, they have limited inter-machine bandwidth, and have unreliable hardware, so reliability needs to be achieved via software mechanisms

### Properties

Scalability

- Aggregation of many resources
  - Compute: cluster of shared nothing machines
  - Storage : distributed file systems
  - Memory: cluster memory
  - Bandwidth: data centre networks / CDNs

Location Transparency

- The client doesn't care which server handles the request

High availability

- We need to mask hardware failures, such as: power outages, disk failures, memory corruption and network switch failures
- We need to mask software failures, such as: bugs, misconfigurations and update failures

Composable Services

- We rely on the composition of independent services
- Good software engineering practices come in useful here

# Data Centres

Data centres are a large group of networked servers, typically built from commodity hardware (however, the network components are typically non-commodity)

They scale out and don't scale up, so the number of servers is increased, not the power of the servers

The software is designed for failure, since with lots of components, probability of failure is very high

The scalable service is the combination of the data centre hardware and software

They're also economies of scale - once you have a lot of hardware at one location, the other costs go down, such as electricity and operations

They need elasticity, so they can provide the resources needed on demand - this is done by having many low-cost PCs rather than a few expensive high-end servers

This creates the illusion of infinite resources from the perspective of tenants

Data centres are also usually stored in their local jurisdiction for data laws, e.g. GDRP, adn also to reduce latency

## Design Principles

### Types of Scalable Systems

- Online Systems (<100 ms)

  - These focus on web content serving, interactive features, and OLTP databases
  - They have a very low latency requirement

- Batch Processing Systems (> 1 hour)

  - These are for offline data processing
  - They're used for data analytics and data warehousing (OLAP)
  - They have no latency requirement - people are OK to wait for a result
  - They're throughput oriented as they handle big data

- Nearline Systems (< 1 secs or mins)
  - These are used where dynamic content is presented to users where freshness matters
  - They're used for things like recommender systems, ad prediction and dashboards
  - High throughput is still important, but there is no strict latency requirement, they just need freshness

### Distributing Computing Challenges

- Scalability

  - Independent parallel processing of sub-requests/tasks
  - E.g. adding more servers permits serving more concurrent requests

- Fault Tolerance

  - Must mask failures and recovers from hardware/software failure
  - Must replicate data and service for redundancy

- High availability

  - Service must operate 24/7

- Consistency

  - Data stored and processed by multiple services must lead to consistent results

- Performance
  - Predictable low-latency processing with high throughput
  - Predictable doesn't necessarily mean super low - it's better to be consistent and reliable than fast but potentially in a large range - you have to think about the tail clients who get the worst latency

### Abstraction

There are many layers of abstraction used - for example:

- Apps
- Computation
- Storage
- File System
- Networking
- Locking

### Stateless Services

Data consistency is hard, so we can avoid consistency by not maintaining data

An example is HTTP, which is a stateless protocol

An example is the separation of data and metadata in the distributed file system, since this means data access can be stateless

### Caching

We need to design systems with low latency

We can do this by thinking of the sources of latency, and adding caches there

We also need to cache close to where the data is needed to make it worthwhile

### Partition/Aggregation Pattern

Data-intensive applications scale by partitioning requests from the frontend into sub-requests, and sending them to multiple backends

This enables task-parallel or data-parallel processing

Then the partial responses are sent back to the front end and aggregated

### Weaker Consistency

Many applications need state replicated across a wide area, for reliability, availability adn low latency access

There are two main choices:

- Strongly consistent operations (e.g. Paxos), which often imposes additional latency for the common case, and so limits scalability
- Inconsistent operations, which perform better and have better availability, but make the apps harder to write and reason about

May apps use a mix of both:

- In Gmail, marking messages as read is asynchronous, but sending a message is a heavier-weight consistent operation
- Spotify song count just needs to be roughly accurate

### Efficient Failure Recovery

We have to think of failure as the common case

Full redundancy is too expensive, so we use failure recovery, where we reduce how much it costs to recover from a failure

There are two options: replication vs recomputation, and it depends on the respective costs

Replication:

- You need to replicate data and service
- Introduces consistency issues

Recomputation:

- Easy for stateless protocols
- You need to remember data lineage for compute jobs
