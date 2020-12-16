---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Databases on Multicores
slug: multicores
topic: 5
hidden: false
tags:
  - Multicores
---

# Introduction

OLTP Databases have lots of <mark>small transactions</mark>, therefore we can benefit by using <mark>multiple cores</mark> to execute these

## The Past & Moore's Law

Execution time can be split into four main categories:

- Computation (~40%)
- Memory (~25%)
- Branch misprediction (~10%)
- Resource (~25%)

Since only around <mark>40% of the time</mark> is actually spent on <mark>computation</mark>, the <mark>rest is stalling</mark>

When <mark>stalling</mark>, the majority of this time it is handling <mark>L2 data or L1 instructions</mark>

Moore's Law still states the <mark>number of transistors doubles every 18 months</mark>, however <mark>clock speeds and power have hit a wall</mark>

We <mark>can't get the energy and data</mark> in to the processor, or the <mark>heat out</mark>, at reasonable speed any more

Before 2005, we introduced pipelining/multithreading and then we moved to multicores

This was due to power concerns - we couldn't add more complexity to one core, so we added more cores

## Current State

Then more recently, we've moved to <mark>multisocket multicores</mark>

This shows that the goal is scalability - to increase the computational power of a setup

This means that vertically, we have a much more complex setup:

Each core has:

- An L1 cache for data
- An L1 cache for instructions
- An L2 cache

The cores then share:

- An L3 Cache / LLC (Last-level Cache)
- Main memory

However, systems designed for traditional architectures are still not great

A setup using the research prototype Shore could <mark>potentially run 4 instructions per cycle</mark>, however, it only <mark>runs about 1 in practice</mark>

This is because around <mark>70% of the time goes to stalls</mark>

Most of the time is <mark>waiting for data</mark> in order to continue execution

Horizontally, we also have a more complex setup, in order to exploit abundant parallelism

Each socket has multiple cores, and all of these cores have another level below the memory controller (for main memory) called the inter-socket link

The inter-socket link allows a socket to access data from another socket

However, accessing data on another socket is extremely slow, it's much faster is the data is on the appropriate socket

The throughput of OLTP will eventually plateau as we increase the number of threads, since we need to access data, and there is a bottleneck if we are accessing a shared data structure (locking)

For OLAP, the restricting factor is memory bandwidth, since we read lots of data, so we can only read as much as our bandwidth allows

Therefore, in today's memory hierarchy, the further aways from the core you get, the more cycles it takes to get data

Access time is around:

- 4 cycles for L1
- 12 cycles for L2
- 30 cycles for L3
- 200 cycles for Main Memory

In practice, there is <mark>no penalty for L1</mark>, but anything lower is where you can get a possible stall

These stalls are a waste of time, power and money, which is why we want to reduce them

# Stalls in Cloud Workflows

There is still around only 1 instruction per cycle, and the rest of the time is mainly spent in memory cycles

So on average, more than 50% of the time goes to stalls

## Sources

In databases, using the benchmarks TPC-C and TPC-E, we know around 70% of execution time is spent on stalls

This is mainly spent on L1 instructions (~50%) and L3 Data (~~30%)

So the problems are:

- Instruction fetch & long-latency data misses
- Instructions need more capacity
- Data misses are compulsory (you can't just make it appear in the cache)

We need to focus on maximising:

- L1 instruction locality
- Cache line utilisation for data

# How to <mark>Minimise Memory Stalls</mark>

## <mark>Prefetching</mark>

### Light

This is the first strategy for prefetching

It's not very hard to implement, bur can be ver powerful

They follow predictable patterns, e.g.:

- <mark>next-line</mark>: if A is missed, we fetch A+1
- <mark>stream</mark>: if we miss A, A+1, we fetch A+2, A+3

This <mark>favours sequential access and spatial locality</mark>

However, it <mark>doesn't do well with instructions such as branches</mark> (we can use branch prediction for this) and function calls

It also <mark>doesn't help with data</mark>, as it doesn't do pointer chasing - to help with this, we can guess a stride if we have a predictable data layout in main memory

For example, if we miss A, A+20, we fetch A+40, A+60

Light prefetching is preferred on real hardware due to its simplicity, however memory stalls are still too high

We need to remember prefetching needs to tae up less time than it saves, otherwise it is not worth it

### Temporal Streaming

This takes advantage of the fact that programs follow the <mark>same flow repeatedly</mark>

The patterns of <mark>cache accesses are roughly the same</mark> on different inputs, and so if we know what the next cache access is most likely to be, we can prefetch it

E.g., if we know a certain instruction always hits the same few blocks of data cache, we can prefetch it before that function is called to save time

This is the case for a lot of programs

We exploit <mark>recurring control flow</mark>

It's more accurate than light prefetching, however it comes at a higher space cost

### Software-Guided

In this case, we can exploit that we <mark>know a data structure</mark> being accessed

For example, if we had a tree, and we wanted to traverse it, we know we'll access a node, then fetch it's child, then go to the child, lookup that one's child, and we can use prefetching of the children here to save time later

We can prefetch the children whilst we are inspecting the parent

## Being <mark>Cache Conscious</mark>

### Code Optimisations

Some straightforward but important steps we can do to reduce stalls are:

- <mark>Simplifying code</mark>
  - In-memory databases do this by having a smaller instruction footprint
  - If there can only be simple instructions, we get a more efficient execution
- <mark>Better code layout</mark>
  - This means minimising jumps, so we exploit the next time prefetcher
  - We can do profile-guided executions, so profile the code
  - Just-in-time, optimise access whilst we are executing code (e.g. query planning)
- Query compilation into <mark>machine/naive code</mark>
  - Systems like HyPer, Hekaton and MemSQL do this
  - Traditional DBMSs interpret queries, which is slow - if you're in main memory, then this is a bottleneck

### Cache Conscious Data Layouts

This means say we have the following data in 16-byte columns:

| Name    | Colour |
| ------- | ------ |
| Erietta | Blue   |
| Pinar   | Black  |
| Danica  | Green  |
| Iraklis | Orange |

If we have a cache line of 64 bytes, we can either:

Row-store them:

| Erietta | Blue | Pinar | Black |
| ------- | ---- | ----- | ----- |


Or we can column-store them:

| Erietta | Pinar | Danica | Iraklis |
| ------- | ----- | ------ | ------- |


This all depends on the queries we are execution, for example the query to select everything in a row (e.g. a single row) will benefit from row store, whereas the query to select everything in a column (e.g. all names) will benefit from column store

This means we <mark>make the most of each cache line</mark>, by using as much of the data on it as possible

The goal is to maximise cache line utilisation and exploit the next-line prefetcher

Row stores are good for OLTP - accessing many columns

Column stores are good for OLAP - accessing a few columns

### Cache Conscious Data Structures

These are things like an <mark>index tree</mark>

We can store it in memory in different ways depending on the type of workload we have

For example:

- In a lookup-heavy tree, we can store the nodes in the order of a depth-first search, since this is how we will search it
- In a scan-heavy-tree, we can store the node in the order of a breadth-first search, so row by row

We also align the nodes to the cache line, so a multiple of nodes sit on a single cache line

The goal is to maximise the cache-line utilisation and exploit the next-line prefetcher in the tree probe

### Vectorised Execution (Volcano Iterator Model)

We have an operator that calls `next()` to get the next tuple

Every time it calls next it gets a piece of data up the hierarchy and then gets it out to the result set

This leads to poor data & instruction cache locality

One way to fix this is to do <mark>vectorised execution</mark>, where we <mark>pull out the whole cache line</mark> on each call to `next()`

This gives good data and instruction cache localityIt also allows us to exploit SIMD

## Exploiting <mark>Common Instructions</mark>

### Computation Spreading

The majority of data is only touched once, and is never touched again

However, instructions have a pretty wide spread between how often they are touched - the majority is hot

This means there is a high overlap in same-type transactions

This means we can use SLICC:

- We move the <mark>transaction to the core in which the data is</mark>
- This exploits that the instruction is already in the L1-I cache
- This reduces the number of calls to the cache

Example:

- Two threads, T1 and T2
- T1 has 4 instructions, T2 has 3 instructions
- The first 3 instructions of both are the same

Conventional:

- We run T1 on core 1, T2 on core 2
- This means there are 7 cache misses, since both cores have to look up the instructions

SLICC:

- We run <mark>one instruction per core</mark>
- This means there are only 4 cache misses, one per core, since the instructions were already in cache
- Cores which are not executing instructions are idle

## Summary of Minimising Stalls

DBMSs underutilise a core's resources

The first main problem: LI-I Misses

- This is due to capacity
- We can mitigate this by:
  - Minimising the footprint of the language
  - Illusion of a larger cache by maximising reuse e.g. SLICC

The second main problem is: <mark>LLC Data Misses</mark>

- These are compulsory
- We can minimise it by:
  - Maximising cache-line utilisation through cache-conscious algorithms and layout

# Scaling Up OLTP

With transactions, we have the problem of locking shared data structures

Threads need to acquire locks to access/update the data, which relies on the system state

There are many accesses to shared data structures - there is no way to not do this on parallel infrastructure

The data access is pretty unpredictable

Code with critical sections means there will be contention

The critical sections are mainly made up of latching and locking, as well as catalog, buffer pool, logging and the transaction manager

There are also many types of critical section:

- Unbounded
  - All threads have access to a single point
  - Lots of threads can want access at once
  - Central source of synchronisation
  - Major scalability bottleneck
  - Used for locking/latching
- Fixed
  - A fixed number of threads can access the CS no matter how many are in the system
  - There is not a bottleneck with more threads
  - Used for hte transaction manager
- Cooperative
  - Different threads can combine their requests whilst they're waiting, and go together
  - Used for logging

We want to make CSs more cooperative

## Unscalable Components

### <mark>Locking</mark>

Hot shared locks cause contention

We have cold and hot locks - either rarely or frequently requested

We're requesting and releasing the same locks repeatedly

#### Speculative Lock Inheritance

One way to reduce this is to use <mark>speculative lock inheritance</mark>

This means if $trxn_1$ uses some hot locks, and $trxn_2$ needs them, it can <mark>commit without releasing the hot locks and pass them</mark> to $trxn_2$

A transaction can seed the lock list of the next transaction, and only pass on locks that transaction doesn't need, returning the rest

This significantly reduces lock contention

This is useful for atomic counters

#### Data-Oriented Transaction Execution

This is where we move from <mark>centralised locking to thread-local locking</mark>

Each thread can use the lock as it pleases, and no other threads can

We do this by making a particular thread always access the same subset of data

This means we don't need to pass locks between threads

This is useful for predictable data accesses, and removes the need for centralised locking

However, we need to adapt the software in order to do this

#### In-Memory Databases

We <mark>don't have a disk, so need no buffer management</mark>

Locking and latching goes away to a large degree, as we no longer have to wait for disk

The case for parallel execution is no longer very strong - we can serialise execution since data accesses are fast

### Latching

We can do <mark>physiological partitioning</mark> (PLP)

This is where, say we have a B-Tree - there can be conflicts on both index and heap pages if two threads want to access the same data

If we assign a <mark>thread to work on a certain range of values</mark> of the tree, then there will be no conflicts, since the worker threads are always separate

This means we will need serial access on specific parts of the tree

There is no replication of data, however it can create an inbalance of workload between threads

### Logging

With normal write-ahead logging, we're appending to a serial log, which is on disk

We need transactions as the IO is slow, and we need to wait for a commit before we can write to the log

We want to reduce the locking when logging

We can do this with <mark>Aether Holistic Logging</mark>

There are three methods:

- <mark>Release the lock</mark> at the <mark>beginning of the commit</mark> phase

- We use <mark>flush pipelining</mark>, which is where we have a dedicated thread which is the log writer, which each thread flushes to

  - The log writer thread takes all requests to write to log and serialises them, and since it's no longer to disk from the main threads, there are no delays in them threads, only in the log thread
  - This reduces context switches

- We can also use a <mark>consolidation array</mark> to minimise log contention, where waiting threads combine their log requests and insert them together

## Non-Uniform Communication

### <mark>Hardware Islands</mark>

We have multiple cores on a socket now

- Accessing on the same L1 cache: < 10 cycles
- Accessing on the same L3 cache: ~ 50 cycles
- Accessing on another socket through inter-socket link: ~500 cycles

So as you can see... we don't want to communicate between sockets often!

Therefore, we make each <mark>socket an island</mark>, and we <mark>don't want to travel between them</mark>

We want to setup out workload so there is minimal access between them

There are three-models:

- Shared-everything
  - Share with any island
  - Stable
  - Not optimal - 500 cycles between sockets
- <mark>Island shared-nothing</mark>
  - Only share within island
  - Robust middle ground
- Shared-nothing
  - Share nothing between sockets or cores
  - Fast
  - Sensitive to workload

The challenges we have are:

- Optimal configuration depends on the workload and hardware
- Expensive repartitioning due to physical data movement

We can do this by use the system state

Adaptive Transaction Processing solves the problem by making everything shared on an island, and it's adaptive to changes in workload and hardware

It uses physiological partitioning and a data oriented transaction model

A request which enters the system is forwarded to the island where most of the data is located

## Summary

To scale up OLTP:

- Identify bottlenecks in existing systems
  - Eliminate bottlenecks systematically and holistically
- Design a new system from the ground up without creating new bottlenecks
- Do not assume uniformity in communication
  - different orders of magnitude of time to access different parts of data
- Choose the right synchronisation mechanism
