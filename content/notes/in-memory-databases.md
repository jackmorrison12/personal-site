---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: In-Memory Databases
slug: in-memory-databases
topic: 2.2
hidden: false
tags:
  - In-Memory Databases
  - VoltDB
  - OLTP
  - NewSQL
---

# Types of Workload: OLAP vs OLTP

<div class="def">
  <span class="is-primary bold">OLAP: </span>Online Analytical Processing
</div>

- <mark>Massive amounts</mark> of data
- <mark>Complex queries</mark>
- Large number of tables
- <mark>Long running</mark>, but still somewhat interactive
- Mostly <mark>read-only</mark>

<div class="def">
  <span class="is-primary bold">OLTP: </span>Online Transaction Processing
</div>

- <mark>Transactions</mark>, i.e. updates, so not loads of data
- Few tables touched
- Typically <mark>generated queries</mark> - triggered by UI, not human written

OLAP databases are in the order of PB - we <mark>have to store this on disk</mark> (or lower), not main memory

OLTP databases are usually smaller and are growing slower. a 1TB transactional database is pretty large - can this can be <mark>put in main memory</mark> for reasonably cheap (since Moore's law has eclipsed OLTP database sizes)

# OLTP Performance

In an OLTP database, time is roughly spent in the following way:

| Time spent on... | Percentage of time spent |
| ---------------- | ------------------------ |
| Latching         | 24%                      |
| Locking          | 24%                      |
| Recovery         | 24%                      |
| Buffer Pool      | 24%                      |
| Useful Work      | 4%                       |

So there is a huge potential to improve the amount of time spent on actual useful work

<mark>To improve the performance, we need to focus on the overhead</mark> (so a better B Tree is only going to affect 4% of the path length!)

<mark>Main memory deployment gets rid of the buffer pool</mark>, which removes 25% of the overhead, as there is no need to read/write to disk

# System Alternatives

## <mark>OldSQL</mark>

These are legacy RDBMS vendors

They <mark>don't scale well in distributed systems</mark>, since they have code dating from the 80s, so weren't designed for it

## <mark>NoSQL</mark>

These <mark>give up SQL and ACID performance to accelerate query execution</mark>

These are <mark>tricky to execute in an efficient and scalable way</mark>, since we no longer have transactions

Giving up SQL means we give up 30 years of RDBMS experience, where lots of time has been spent to make them efficient

High level languages are also really good for abstraction, and mean not a lot of time is spent on implementation level details - removing SQL gets rid of this!

SQL also has <mark>stored procedures</mark> - were you move the code to the data (as it's stored on the DBMS), and so only one round trip is needed from the app to the DBMS rather than one round trip per record

If you need data consistency, then giving up ACID means you'll <mark>have to do a lot of the heavy lifting in the user code</mark>

It's hard to guarantee a system will not need ACID in the future

ACId is needed when there is a limited resource, e.g. a funds transfer

So in conclusion, NoSQL is useful:

- for <mark>non-transactional systems</mark>
- for systems with <mark>single record transactions which are commutative</mark>

## <mark>NewSQL</mark>

These <mark>preserve SQL and ACID</mark>, but get their <mark>performance and scalability from a new architecture</mark>

The main sources of overhead for OLTP databases which NewSQL addresses are:

1. They need something other than <mark>traditional record-level locking</mark>, since every lock introduces a bottleneck

2. They need to get rid of the <mark>buffer pool</mark>, which can be done by moving to main memory

3. They need a solution to <mark>latching for shared data structures</mark> - we care more about throughput vs latency

4. They need a solution to <mark>write-ahead logging</mark>, which is a big overhead, and so need another mechanism to recover from failure

## Old TP vs New TP

OldSQL for New OLTP:

- Not good
- Too slow
- Does not scale

NoSQL for New OLTP:

- Not good
- Lacks consistency guarantees
- Low-level interface

NewSQL for New OLTP:

- Good
- Fast, scalable and consistent
- Supports SQL

# VoltDB

## Overview

This is an example of NewSQL

It uses <mark>main memory storage</mark>

It's <mark>single threaded</mark>, so no locking or latching

<mark>Transactions should be small</mark>, so they can be run to completion

<mark>Built-in high availability and durability</mark>, and so no log is needed

This means, the time is now spent in the following way:

| Time spent on... | Percentage of time spent |
| ---------------- | ------------------------ |
| Locking          | 5%                       |
| Useful Work      | 95%                      |

We still need a small amount of locking, but we removed the overheads by:

- Latching & Locking - Single threaded
- Recovery - Mirroring data
- Buffer Pool - Using main memory

Currently, it runs a subset of SQL

It runs on a <mark>custer of commodity machines</mark>, and scales well up to 384 cores, which allows for a fairly big database with a lot of main memory

## Technical Overview

VoltDB avoids the overhead of traditional databases

- <mark>K-safety for fault tolerance</mark>, where it has K copies of the same data, so replicas if the data is lost...
  - ... therefore no locking
- <mark>In-memory operation</mark>, for maximum throughput...
  - ... therefore no buffer management
- <mark>Partitions operate autonomously and single-threaded</mark>...
  - ... therefore no latching or locking

It's built to <mark>horizontally scale</mark>

There is <mark>some locking involved for multi-partition operations</mark>, but if you stay within the partition, there is no locking

### Partitions

There is <mark>one partition per physical CPU core</mark>

Each <mark>physical server has multiple VoltDB partitions</mark>

Data is in two types of tables:

- <mark>Partitioned</mark>:
  - Single column as partitioning key
  - <mark>Rows are spread across all VoltDB partitions</mark> by partition column
  - Used for <mark>transactional data</mark> - to reduce the size of partition/amount of data being touched
- <mark>Replicated</mark>:
  - <mark>All rows exist in all VoltDB partitions</mark>
  - Used for <mark>relatively static data</mark> - requires more effort to update

Code does two types of work (both ACID):

- <mark>Single-Partition</mark>
  - All insert/update/delete operations in a single partition
  - Majority of transactional workload
- <mark>Multi-Partition</mark>
  - CRUD against partitioned tables across multiple partitions
  - Insert/update/delete on replicated tables
  - Requires locking

Inside of a VoltDB partition...

- Each partition contains <mark>data and an execution engine</mark>
- The execution engine contains a <mark>queue for transaction requests</mark>
- Requests are <mark>executed sequentially</mark> (single threaded)

### Compiling

The database is constructed from:

- The <mark>schema</mark> (DDL)
- The <mark>workload</mark> (Java stored procedures)
- The <mark>project</mark> (users, groups, partitioning) - how we will use the schema and workload

The VoltCompiler creates an <mark>application catalog</mark>

It copies this to the servers and starts the servers

### Transactions

All access to VoltDB is via <mark>Java stored procedures</mark> - this is where we do the logic

A single invocation of a stored procedure is a transaction - it is committed on success

This limits the number of round trips between the DBMS and application

We also have <mark>asynchronous communication</mark> between the high performance client and VoltDB, which is efficient

### Clusers/Durability

<mark>Scalability</mark>

- To add capacity, add another server with more RAM
- To increase performance, add more servers which have more processing capacity

<mark>High availability</mark>

- Due to K-safety for redundancy

<mark>Snapshots</mark>

- These are done either scheduled, continuous or on demand
- Spooling is done to data warehouses, where a snapshot is put there for OLAP purposes

<mark>Disaster recovery</mark>

- Asynchronous replication with the k-safety, as we have a mirror of the data

## VoltDB and OLTP

### Asynchronous Communications

Client applications <mark>communicate asynchronously with VoltDB</mark>

<mark>Stores procedures</mark> are <mark>send through the network</mark>, and <mark>invoked on the server</mark>, and <mark>responses are then pulled from the server</mark>

The client gives an <mark>async callback method</mark>, which will be called once the result has been calculated

It allows a single client to generate >100k TPS

A client library can simulate being synchronous if it is needed

### Transaction Control

VoltDB <mark>doesn't support client side transactional control</mark>

Clients <mark>can't abort or roll back a transaction</mark>

Stored procedures will commit on success and rollback on failure

However, the client code in a stored procedure could call for a rollback

### Lack of Concurrency

VoltDB has <mark>single-threaded execution</mark> within partitions or across partitions

This means there is <mark>no need to worry about locking</mark>, which is great for mostly read only applications

This means <mark>transactions need to execute very fast</mark>, in microseconds

However, being single threaded means:

- Other transactions have to <mark>wait for the running transaction to complete</mark>
- Stored procedures <mark>can't do anything crazy</mark>, like request a web page, since this will hold up other transactions

This means it's useful for OLTP but not OLAP, as it's optimised for throughput not latency

### Throughput vs. Latency

As we just said, VoltDB is <mark>built for throughput over latency</mark>

Latency is measured in mid single-digits in a properly sized cluster (not 1/TPS)

If the wait is too long, then you add more servers to the setup

### SQL Support

VoltDB supports:

- SELECT, INSERT, UPDATE and DELETE
- Aggregate SQL (AVG, COUNT, MAX, MIN, SUM)
- Materialised views (COUNT, SUM)
- Hash and tree indexes
- Stored procedures (for missing functionality)

<mark>Execution plan for all SQL is created at compile time</mark>, and is available for analysis

### Schema Changes

Traditional OLTP:

- add table...
- alter table...

VoltDB:

- Modify schema and stored procedures
- Build catalog
- Deploy catalog

To add more steps, you need to rebuild and redeploy
