---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Dynamo
slug: dynamo
topic: 9
hidden: false
tags:
  - Dynamo
  - Amazon
---

Dynamo is Amazon's Highley Available Key-Value Store

## Motivation

In modern data centres, there are hundreds of services running

These run on thousands of commodity machines, and serve millions of customers at peak times

In order to earn money, they need performance, reliability and efficiently

This means outages are bad, since customers lose confidence, and businesses lose money

However accidents, happen, and so Dynamo was built to tolerate these accidents

## Service Requirement in Data Centres

Availability: Service must be accessible at all times

Scalability: Service must scale well to handle customer and machine growth

Failure Tolerance: With thousands of machines, failure is inevitable, individual failures should be handled

Manageability: It must have a low admin cost to maintain

## Dynamo's Design Assumptions

Query Model

- Simple read/write operations with unique IDs
- No operations span multiple records 9one key at a time, for performance)
- Data is stores as binary objects of small size

ACID Properties

- Weaker (eventual) consistency
  - Eventually, every node will be consistent

Efficiency

- Optimise for the 99.9th percentile

## Dynamo's API

Dynamo's API only had 2 operations:

```
put(key, context, object)

get(key)
```

Where:

- `key`: Primary key associated with the data object
- `context`: Vector clocks and history (needed for merging)
- `object`: Data to store

## CAP Theorem

The CAP Theorem states that you can have 2 of: Consistency, Availability and Partition-Tolerance

For Dynamo, availability of online services = customer trust, and so we can't sacrifice that

In data centres, failures happen all of the time, so we must tolerate partitions too

Therefore, Dynamo has to sacrifice consistency

Usually to ensure consistency, replicas need to coordinate - if partitions are not connected, they wait

Most other systems sacrifice availability, so the system is down if a partition is down

### Eventual Consistency

Dynamo works around the consistency problem by having an eventual consistency model

Many services do tolerate consistency, but if consistency is lost, eventually it will be restored

Dynamo sacrifices strong consistency for availability

Conflict resolution is executed during reads instead of writes, so it's always writable - they always succeed with low latency

We can't know if all replicas are consistent at a given time

However, at some point, consistency will be reconciled (on reads)

## Service Level Agreements (SLAs)

Cloud computing and virtual hosting contracts include SLAs

The outline the expectations the clients have - most are described in terms of mean, median and variance of response times

They use these since services will suffer from outliers, and so they can't be guaranteed for every request

Amazon targets optimisation for 99.9% of queries, so outliers are very rare

Apps should be able to configure Dynamo for their desired latency and throughput

An example SLA would be: At least 99.9% of read/write operations must be performed within a few hundred milliseconds

## Design Considerations

Incremental Scalability

- The system should be able to grow by adding a storage host (node) at a time

Symmetry

- Every node has the same set of responsibilities

Decentralisation

- Decentralised techniques are favoured over central coordinators
- There are no 'special nodes' for specific functionality

Hererogeneity

- Workload partitioning should be proportional to the capabilities of the servers
- Not all servers are made equal!

## Techniques Used

| Problem                            | Technique                                              | Advantage                                                                                                        |
| ---------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Partitioning                       | Consistent Hashing                                     | Incremental Scalability                                                                                          |
| High availability for writes       | Vector clocks with reconciliation during reads         | Version size is decoupled from update rates                                                                      |
| Handling temporary failures        | Sloppy Quorum and hinted handoff                       | Provides high availability and durability guarantees when some of the replicas are not available                 |
| Recovering from permanent failures | Anti-entropy using Merkle trees                        | Synchronises divergent replicas in the background                                                                |
| Membership and failure detection   | Gossip-based membership protocol and failure detection | Preserves symmetry and avoids having a centralised registry for storing membership and node liveness information |

## Consistency & Availability

Strong consistency and availability cannot be achieved simultaneously

Optimistic replication techniques are used, which lead to an eventually consistent model

- Changes are propagated to replicas in the background
- Can lead to conflicting changes that have to be detected and resolved

Conflict resolution happens during reads

- Dynamo is designed to be an "always writable" data store - highly available
- Read/write operations can continue even during network partitions
- Rejecting customer updates won't be a good experience - e.g. customer should always be able to add/remove items in their shopping cart

There are two options for who resolves the conflicts: data store or application

Data store

- This is application-unaware, so the choices are limited
- Usually a simple policy, like "last write wins"

Application

- The application is aware of the meaning of the data
- Can do application-aware conflict resolution
- E.g. merge shopping cart versions to get unified shopping cart

If the application doesn't resolve a conflict, it can fall back to last write wins

## Data Partitioning & Replication

Consistent hashing is used

- Regular hashing means that a change int he number of slots requires all keys to be remapped
- Consistent hashing means only $\frac{K}{n}$ keys need to be remapped, where $K$ = number of keys, $n$ = number of slots
  - E.g. of there are 100 keys and 10 slots, then when a new slot is added, only 10 keys are changed, as each slot donates a key to the new one

It uses a distributed hash table (DHT) & replication

### DHT

- Each node gets an ID from the space of keys
- The nodes are arranged in a ring
- Data is stored on the first node clockwise of the current placement of the data key

The DHT provides peer-to-peer hash lookup, where looking up the key gives the IP address of the node which stores that key

They key and node identifier are hashed with SHA-1, so that they're both uniformly distributed and exist int he same ID space

A key is stores at its successor, which is the node with the next highest ID

To do a lookup, each node has a global view of the ring structure, and so can directly jump to the correct node in the ring

The DHT ring makes use of virtual nodes

- Each physical node has multiple virtual nodes
- More powerful machines have more virtual nodes (heterogeneity)
- Virtual nodes are distributed across the ring

This means there is a balanced load distribution:

- If a node becomes unavailable, the load is evenly dispersed among available nodes
- If a node is added, it accepts an equivalent amount of the load from other nodes
- The number of virtual nodes per system can be based on the capacity of that node

### Data Replication

Dynamo has preference lists of N nodes following the associated node

Data is replicated on these N hosts, where N is configurable

- The key is assigned a coordinator node (via hashing)
- The coordinator node is in charge of replication

The coordinator replicated keys at N-1 clockwise successor nodes in the ring

### Data Versioning

Not all updates may arrive at all replicas

Therefore, Dynamo does 2 things:

- Application-based reconciliation
  - Each modification of data is treated as a new version
- Vector clocks are used for versioning
  - These capture the causality between different versions of the same object
  - A vector clock is a set of (node, counter) pairs
  - It's returned as the context from a get() operation

### Execution of `get()` and `put()`

The coordinator node is among the top N in the preference list

The coordinator a R W quorum system:

R = read quorum

W = write quorum

This means at least R replicas are needed to handle a read, and at least W replicas are needed to handle a write

Usually in a quorum, R + W > N, however in Dynamo, this is not needed as stale data can be returned, but it's eventually consistent

## Storage Nodes

Each node has 3 components:

- Request coordination
  - Coordinator read/write requests on behalf of requesting clients
  - State machine contain all of the logic for identifying nodes responsible for a key, sending requests, waiting for responses, retries, processing retries and packaging responses
  - Each state machine instance handles one request
- Membership and failure detection
  - A background gossip-based protocol shares the current view of the Dynamo ring to synchronise the current stage
- Local persistent storage
  - Different storage engines can be used depending on the needs, e.g. My SQL or an in-memory buffer

## Handling Failures

Temporary failures (e.g. a network failure) are handled with Hinted Handoff

- This offloads data to the node that follows the last node in the preference list on the ring
- It hints that this is temporary
- The responsibility is sent back when the node recovers

Permanent failures are handled with Replica Synchronisation

- Lost node is synchronised with another node
- Uses Merkle trees

### Merkle Trees

This is a tree consisting of hashes

The leaves are hashes of individual keys, and parents are hashes of their children

The advantage is that parts can be checked without having to compare the whole tree - start with the root and work down

### Membership & Failure Detection

Ring membership

- This is determined by a background gossip protocol to build a 1-hop DHT
- An external entity is used to bootstrap the system to avoid partitioned rings

Failure Detection

- This is implemented using:
  - Standard gossip
  - Heartbeats
  - Timeouts

## Evaluation

### Request latency

The 99.9th percentile for both reads and writes is below 300ms

The average is a lot lower, between 10 and 20ms

### Buffered Writes

Buffered writes boost performance of the 99.9th percentile response times

### Load Balancing

The higher the request load ,the better the balance, so if more requests are being made, then less nodes are out of balance (there isn't one node doing a lot more work than the others)

## Comparison to [Bigtable](/notes/scalable-systems/bigtable)

Dynamo targets apps that only need key/value access with a primary focus on high availability

Dynamo is a key-value store, whereas Bigtable is a column store

Bigtable is a distributed database built of GFH, whereas Dynamo is a distributed hash table, where each node is responsible for storage

In Dynamo, updates are not rejected even during network partitions or server failures
