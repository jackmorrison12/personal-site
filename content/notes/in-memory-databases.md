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
  - Vault DB
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

OLAP databases are in the order of PB - we hve to store this on disk (or lower), not main memory

OLTP databases are usually smaller and are growing slower. a 1TB transactional databse is pretty large - can this can be put in main memory for reasonably cheap (since Moore's law has eclipsed OLTP database sizes)

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

To improve the performance, we need to focus on the overhead (so a better B Tree is only going to affect 4% of the path length!)

We need to get rid of all of the major sources of overhead

Main memory deployment gets rid of the buffer pool, which removes 25% of the overhead, as there is no need to read/write to disk

# System Alternatives

## OldSQL

These are legacy RDBMS vendors

They don't scale well in distributed systems, since they have code dating from the 80s, so weren't designed for it

## NoSQL

These give up SQL and ACID performance to accelerate query execution

These are tricky to execute in an efficient and scalable way, since we no longer have transactions

Giving up SQL means we give up 30 years of RDBMS experience, where lots of time has been spent to make them efficient

High level languages are also really good for abstraction, and mean not a lot of time is spent on implementation level details - removing SQL gets rid of this!

SQL also has stored procedures - were you move the code to the data (as it's stored on the DBMS), and so only one round trip is needed from the app to the DBMs rather than one round trip per record

If you need data consistency, then giving up ACID means you'll have to do a lot of the heavy lifting in the user code

It's hard to guarantee a system will not need ACID in the future

ACId is needed when there is a limited resource, e.g. a funds transfer

So in conclusion, NoSQL is useful

- for non-transactional systems
- for systems with single record transactions which are commutative

## NewSQL

These preserve SQL and ACID, but get their performance and scalability from a new architecture

The main sources of overhead for OLTP databases which NewSQL addresses are:

1. They need something over than traditional record-level locking, since every lock introduces a bottleneck

2. They need to get rid of the buffer pool, which can be done by moving to main memory

3. They need a solution to latching for shared data structures - we care more about throughput vs latency

4. They need a solution to write-ahead logging, which is a big overhead, and so need another mechanism to recover from failure

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

It uses main memory storage

It's single threaded, so no lockingor latching

Transactions should be small, so they can be run to completion

Built-in high availability and durability, and so no log is needed

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

It runs on a custer of commodity machines, and scales well up to 384 cores, which allows for a fairly big database with a lot of main memory

## Technical Overview

VoltDB avoids the overhead of traditional databases

- K-safety for fault tolerance, where it has K copies of the same data, so replicas if the data is lost...
  - ... therefore no locking
- In memory operation, for maximum throughput...
  - ... therefore no buffer management
- Partitions operate autonomously and single-threaded...
  - ... therefore no latching or locking

It's built to horizontally scale

There is some locking involved for multi-partition operations, but if you stay within the partition, there is no locking

### Partitions

There is one partition per physical CPU core

Each physical server has multiple VoltDB partitions

Data is in two types of tables:

- Partitioned:
  - Single column as partitioning key
  - Rows are spread across all VoltDB partitions by partition column
  - Used for transactional data - to reduce the size of partition/amount of data being touched
- Replicated:
  - All rows exist in all VoltDB partitions
  - Used for relatively static data - requires more effort to update

Code does two types of work (both ACID):

- Single-Partition
  - All insert/update/delete operations in a single partition
  - Majority of transactional workload
- Multi-Partition
  - CRUD against partitioned tables across multiple partitions
  - Insert/update/delete on replicated tables
  - Requires locking

Inside of a VoltDB partition...

- Each partition contains data and an execution engine
- The execution engine contains a queue for transaction requests
- Requests are executed sequentially (single threaded)

### Compiling

The database is constructed from:

- The schema (DDL)
- The workload (Java stored procedures)
- The project (users, groups, partitioning) - how we will use the schema and workload

The VoltCompiler creates an application catalog

It copies this to the servers and starts the servers

### Transactions

All access to VoltDB is via Java stored procedures - this is where we do the logic

A single invocation of a stored procedure is a transaction - it is committed on success

This limits the number of round trips between the DBMS and application

We also have asynchronous application between the high performance client and VoltDB, which is efficient

### Clusers/Durability

Scalability:

- To add capacity, add another server with more RAM
- To increase performance, add more servers which have more processing capacity

High availability

- Due to K-safety for redundancy

Snapshots

- These are done either scheduled, continuous or on demand
- Spooling is done to data warehouses, where a snapshot is put there for OLAP purposes

Disaster recovery

- Asynchronous replication with the k-safety, as we have a mirror of the data

## VoltDB and OLTP

### Asynchronous Communications

Client applications communicate asynchronously with VoltDB

Stores procedures are send through the network, and invoked on the server, and responses are then pulled from the server

The client gives an async callback method, which will be called once the result has been calculated

It allows a single client to generate >100k TPS

A client library can simulate being synchronous if it is needed

### Transaction Control

VoltDB doesn't support client side transactional control

Clients can't abort or roll back a transaction

Stored procedures will commit on success and rollback on failure

However, the client code in a stored procedure could call for a rollback

### Lack of Concurrency

VoltDb has single-threaded execution within partitions or across partitions

This means there is no need to worry about locking, which is great for mostly read only applications

This means transactions need to execute very fast, in microseconds

However, being single threaded means:

- Other transactions have to wait for the running transaction to complete
- Stored procedures can't do anything crazy, like request a web page, since this will hold up other transactions

This means it's useful for OLTP but not OLAP, as it's optimised for throughput not latency

### Throughput vs. Latency

As we just said, VoltDB is built for throughput over latency

Latency is measured in mid single-digits in a properly sized cluster (not 1/TPS)

If the wait is too long, then you add more servers to the setup

### SQL Support

VoltDB supports:

- SELECT, INSERT, UPDATE and DELETE
- Aggregate SQL (AVG, COUNT, MAX, MIN, SUM)
- Materialised views (COUNT, SUM)
- Hash and tree indexes
- Stored procedures (for missing functionality)

Execution plan for all SQL is created at compile time, and is available for analysis

### Schema Changes

Traditional OLTP:

- add table...
- alter table...

VoltDB:

- Modify schema and stored procedures
- Build catalog
- Deploy catalog

To add more steps, you need to rebuild and redeploy
