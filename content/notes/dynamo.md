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

Dynamo is Amazon's <mark>Highly Available Key-Value Store</mark>

## Motivation

In modern data centres, there are hundreds of services running

These run on <mark>thousands of commodity machines</mark>, and serve millions of customers at peak times

In order to earn money, they need <mark>performance, reliability and efficiently</mark>

This means outages are bad, since customers lose confidence, and businesses lose money

However accidents, happen, and so Dynamo was <mark>built to tolerate these accidents</mark>

## Service Requirement in Data Centres

<mark>Availability</mark>: Service must be accessible at all times

<mark>Scalability</mark>: Service must scale well to handle customer and machine growth

<mark>Failure Tolerance</mark>: With thousands of machines, failure is inevitable, individual failures should be handled

<mark>Manageability</mark>: It must have a low admin cost to maintain

## Dynamo's Design Assumptions

Query Model

- Simple <mark>read/write operations with unique IDs</mark>
- <mark>No operations span multiple records</mark> (one key at a time, for performance)
- Data is stores as <mark>binary objects of small size</mark>

ACID Properties

- Weaker <mark>(eventual) consistency</mark>
  - Eventually, every node will be consistent

Efficiency

- Optimise for the <mark>99.9th percentile</mark>

## Dynamo's API

Dynamo's API only had 2 operations:

```
put(key, context, object)

get(key)
```

Where:

- `key`: <mark>Primary key</mark> associated with the data object
- `context`: <mark>Vector clocks and history</mark> (needed for merging)
- `object`: <mark>Data to store</mark>

## CAP Theorem

The CAP Theorem states that you <mark>can have 2 of: Consistency, Availability and Partition-Tolerance</mark>

For Dynamo, availability of online services = customer trust, and so we can't sacrifice that

In data centres, failures happen all of the time, so we must tolerate partitions too

Therefore, <mark>Dynamo has to sacrifice consistency</mark>

Usually to ensure consistency, replicas need to coordinate - if partitions are not connected, they wait

Most other systems sacrifice availability, so the system is down if a partition is down

### Eventual Consistency

Dynamo works around the consistency problem by having an <mark>eventual consistency model</mark>

Many services do tolerate consistency, but if consistency is lost, eventually it will be restored

Dynamo <mark>sacrifices strong consistency for availability</mark>

<mark>Conflict resolution is executed during reads instead of writes</mark>, so it's <mark>always writable</mark> - they always <mark>succeed with low latency</mark>

We <mark>can't know if all replicas are consistent</mark> at a given time

However, at some point, consistency will be reconciled (on reads)

## Service Level Agreements (SLAs)

Cloud computing and virtual hosting contracts include SLAs

The outline the <mark>expectations the clients have</mark> - most are described in terms of <mark>mean, median and variance of response times</mark>

They use these since <mark>services will suffer from outliers</mark>, and so they can't be guaranteed for every request

Amazon targets optimisation for 99.9% of queries, so outliers are very rare

Apps should be able to configure Dynamo for their desired latency and throughput

An example SLA would be: At least 99.9% of read/write operations must be performed within a few hundred milliseconds

## Design Considerations

Incremental Scalability

- The system should be able to <mark>grow by adding a storage host (node) at a time</mark>

Symmetry

- Every <mark>node has the same set of responsibilities</mark>

Decentralisation

- Decentralised techniques are favoured over central coordinators
- There are <mark>no 'special nodes' for specific functionality</mark>

Hererogeneity

- Workload <mark>partitioning should be proportional to the capabilities of the servers</mark>
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

- <mark>Changes are propagated to replicas in the background</mark>
- Can lead to <mark>conflicting changes that have to be detected and resolved</mark>

Conflict resolution happens during reads

- Dynamo is designed to be an "always writable" data store - highly available
- Read/write operations can continue even during network partitions
- Rejecting customer updates won't be a good experience - e.g. customer should always be able to add/remove items in their shopping cart

There are two options for <mark>who resolves the conflicts</mark>: data store or application

<mark>Data store</mark>

- This is <mark>application-unaware</mark>, so the choices are limited
- Usually a simple policy, like <mark>"last write wins"</mark>

<mark>Application</mark>

- The <mark>application is aware</mark> of the meaning of the data
- Can do application-aware <mark>conflict resolution</mark>
- E.g. merge shopping cart versions to get unified shopping cart

If the application doesn't resolve a conflict, it can fall back to last write wins

## Data Partitioning & Replication

<mark>Consistent hashing</mark> is used

- Regular hashing means that a change in the number of slots requires all keys to be remapped
- Consistent hashing means <mark>only $\frac{K}{n}$ keys need to be remapped</mark>, where $K$ = number of keys, $n$ = number of slots
  - E.g. of there are 100 keys and 10 slots, then when a new slot is added, only 10 keys are changed, as each slot donates a key to the new one

It uses a distributed hash table (DHT) & replication

### DHT

- Each <mark>node gets an ID from the space of keys</mark>
- The <mark>nodes are arranged in a ring</mark>
- Data is stored on the <mark>first node clockwise of the current placement of the data key</mark>

The DHT provides <mark>peer-to-peer hash lookup</mark>, where looking up the key gives the IP address of the node which stores that key

They <mark>key and node identifier are hashed with SHA-1</mark>, so that they're both <mark>uniformly distributed and exist in the same ID space</mark>

A key is stores at its successor, which is the node with the next highest ID

To do a lookup, each node has a <mark>global view of the ring structure</mark>, and so can directly <mark>jump to the correct node</mark> in the ring

The DHT ring makes use of <mark>virtual nodes</mark>

- Each <mark>physical node has multiple virtual nodes</mark>
- <mark>More powerful</mark> machines have <mark>more virtual nodes</mark> (heterogeneity)
- Virtual nodes are <mark>distributed across the ring</mark>

This means there is a <mark>balanced load distribution</mark>:

- If a node becomes <mark>unavailable</mark>, the <mark>load is evenly dispersed</mark> among available nodes
- If a node is <mark>added</mark>, it <mark>accepts an equivalent amount of the load from other nodes</mark>
- The <mark>number of virtual nodes</mark> per system can be based on the <mark>capacity of that node</mark>

### Data Replication

Dynamo has <mark>preference lists of N nodes</mark> following the associated node

<mark>Data is replicated on these N hosts</mark>, where N is configurable

- The <mark>key is assigned a coordinator node</mark> (via hashing)
- The <mark>coordinator node is in charge of replication</mark>

The coordinator replicated keys at N-1 clockwise successor nodes in the ring

### Data Versioning

<mark>Not all updates may arrive at all replicas</mark>

Therefore, Dynamo does 2 things:

- Application-based <mark>reconciliation</mark>
  - Each <mark>modification of data is treated as a new version</mark>
- <mark>Vector clocks</mark> are used for <mark>versioning</mark>
  - These capture the <mark>causality between different versions</mark> of the same object
  - A vector clock is a set of (node, counter) pairs
  - It's returned as the context from a get() operation

### Execution of `get()` and `put()`

The <mark>coordinator node is among the top N in the preference list</mark>

The coordinator a R W quorum system:

R = read quorum

W = write quorum

This means at least R replicas are needed to handle a read, and at least W replicas are needed to handle a write

Usually in a quorum, R + W > N, however in Dynamo, this is not needed as stale data can be returned, but it's eventually consistent

It uses a <mark>sloppy quorum</mark> - it doesn’t enforce strong consistency - stale data can be returned

It sends read/write requests to N nodes, which require R and E successful responses, but those may include nodes that are not among the designated N “home” nodes for a value, so you can write to a different node if needed

## Storage Nodes

Each node has 3 components:

- <mark>Request coordination</mark>
  - Coordinator read/write requests on behalf of requesting clients
  - State machine contain all of the logic for identifying nodes responsible for a key, sending requests, waiting for responses, retries, processing retries and packaging responses
  - Each state machine instance handles one request
- <mark>Membership and failure detection</mark>
  - A background <mark>gossip-based protocol</mark> shares the current view of the Dynamo ring to synchronise the current stage
- Local <mark>persistent storage</mark>
  - Different storage engines can be used depending on the needs, e.g. My SQL or an in-memory buffer

## Handling Failures

<mark>Temporary</mark> failures (e.g. a network failure) are handled with <mark>Hinted Handoff</mark>

- This <mark>offloads data to the node that follows the last node in the preference list</mark> on the ring
- It hints that this is temporary
- The <mark>responsibility is sent back when the node recovers</mark>

Permanent failures are handled with <mark>Replica Synchronisation</mark>

- Lost node is synchronised with another node
- Uses <mark>Merkle trees</mark>

### Merkle Trees

This is a <mark>tree consisting of hashes</mark>

The <mark>leaves are hashes of individual keys</mark>, and <mark>parents are hashes of their children</mark>

The advantage is that parts can be checked without having to compare the whole tree - start with the root and work down

### Membership & Failure Detection

<mark>Ring membership</mark>

- This is determined by a <mark>background gossip protocol</mark> to build a 1-hop DHT
- An external entity is used to bootstrap the system to avoid partitioned rings

<mark>Failure Detection</mark>

- This is implemented using:
  - Standard <mark>gossip</mark>
  - <mark>Heartbeats</mark>
  - <mark>Timeouts</mark>

## Evaluation

### Request latency

The <mark>99.9th percentile</mark> for both reads and writes is <mark>below 300ms</mark>

The <mark>average is a lot lower</mark>, between 10 and 20ms

### Buffered Writes

<mark>Buffered writes boost performance</mark> of the 99.9th percentile response times

### Load Balancing

The higher the request load, the better the balance, so if <mark>more requests are being made, then less nodes are out of balance</mark> (there isn't one node doing a lot more work than the others)

## Comparison to [Bigtable](/notes/scalable-systems/bigtable)

Dynamo targets apps that only need <mark>key/value access</mark> with a <mark>primary focus on high availability</mark>

Dynamo is a <mark>key-value store</mark>, whereas Bigtable is a column store

Bigtable is a <mark>distributed database</mark> built of GFS, whereas Dynamo is a <mark>distributed hash table</mark>, where each node is responsible for storage

In Dynamo, <mark>updates are not rejected</mark> even during network partitions or server failures
