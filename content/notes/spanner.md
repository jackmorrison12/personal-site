---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Spanner
slug: spanner
topic: 10
hidden: false
tags:
  - Spanner
  - Google
---

Spanner is Google's globally distributed database

## What is Spanner?

Spanner was the next step from [Bigtable](/notes/scalable-systems/bigtable) in RDBMS evolution with strong time semantics: a distribute multi-version database

Some of the key features are:

- General purpose transactions (ACID)
  - Externally consistent global write-transactions with synchronous replication
  - Transactions across data centres
  - Lock-free read-only transactions
- Schematised, semi-relational data model
  - SQL-like query interface

It's currently running in production, providing storage for Google's advertisement data, replacing a manually sharded MySQL database

Its main property is that it has external consistency of distributed transactions

- This means everyone agrees the same external order of transaction execution using global timestamps
- It was the first system of its kind at global scale
- It enables transaction serialisation via global timestamps

It's implemented using an integration of concurrency control, replication and two-phase commit

- It focuses on correctness and performance
- It has auto-sharding, auto-rebalancing and automatic failure response

The enabling technology for all of this is TrueTime

- This is an interval-based global time
- It acknowledges clock uncertainty and guarantees a bound on it, imposing a total order over timestamps
- It uses GPS devices and Atomic clocks to get an accurate time
- Each clock maintains an estimate of the worst time inaccuracy that could exist

## Read Transactions

Using the example of a social network, we may want to generate a page of friends' recent posts

We need a consistent view of our friends list and their posts

consistency is important, sine, if someone removes a friend and then posts something, it must be guaranteed the person they removed cannot see the post - if the order is not enforced globally, this could cause issues

On one machine, we could just block all writes, take a consistent snapshot of the database state, and execute the read against the snapshot

However, when using multiple machines, the snapshots across all machines need to be consistent - taken at the same time in order ot get a consistent view of the data

With multiple data centres, this is even harder, since there are high latencies between data centres, and so it's hard to reason about snapshot consistency

Therefore, we need external consistency - this means we have a consistent view of the database

- This a synchronised snapshot read of the database
- The effect of past transactions should be seen and he effect of future transactions should not be seen across all data centres

It's equivalent to linearisability

If transaction $T1$ commits before another transaction $T2$ starts, then $T1$'s commit timestamp is smaller than $T2$'s

Any read that sees $T2$ must see $T1$

It's the strongest consistency guarantee which can be achieved in practice

Transactions that write use strict two phase locking (2PL)

Each transaction $T$ is assigned a timestamp $s$, and data written by $T$ is timestamped by $s$

To synchronise snapshot, we use global wall-clock time

External Consistency therefore means:

- Commit order respects the global wall-time order
- Timestamp order respects the global wall-time order

Since the timestamp order is equal to the commit order

## Read-Write Transaction

Read locks are used on all data items what have been read

- This is so a consistent snapshot is read
- the locks are acquired at the leader
- They read the latest version, not based on the timestamp

Writes are buffered, and acquire write locks at commit time (when the preparation is done)

The timestamp is assigned at commit time, based on globally-ordered timestamps, and the data version is written with the commit timestamp

Write transactions follow a strict 2PL - the timestamp must be assigned while the locks are held

The timestamp is in the range from when locks are acquired to when they're released - this is the definitive time this transaction was committed, and its effects will be visible in the system after the locks are released

The timestamp order respects the global wall-time order, so the timestamp order is equal to the commit order

## Clock Skew

Typically in distributed systems, there is no global clock

Individual nodes have local clocks which have clock skew

This means the timestamps lead to a partial order,

## TrueTime

This is the novel API behind Spanner's core innovation

It leverages hardware features such as GPS and Atomic Clocks

They key methods in the API is `now()`: it not only returns the current system time, but also a value ($\varepsilon$) which tells the maximum uncertainty

Each data centre has a set of time master servers, and machines have time slave daemons

The majority of time masters are fitted with GPS clocks, and a few others called Armageddon masters are fitted with atomic clocks

The daemon polls a variety of masters and reaches a consensus about the correct timestamp - it syccs the clocks and uses the uncertainty to narrow down the actual time

Both GPS and Atomic clocks are used since they have different failure rates and scenarios - this reduces uncertainty

There are also two more API methods, which return booleans:

- `After(t)` - returns `True` if `t` is definitely passed
- `Before(t)` - returns `True` if `t` is definitely not arrived

These both take into account uncertainty

TrueTime uses these methods in concurrency control, and to serialise transactions

Therefore, the final results ia "Global wall-clock time" with bounded uncertainty

### TrueTime-supported Transactions

Read-Write - requires locks

Read-only - lock free

- Requires a consistent snapshot of the data
- Requires declaration before start of transaction
- reads information that is up-to-date

Snapshot-read - read information from the past by specifying timestamp or bound

- Use specific timestamp from the past or timestamp bound so that data until that point will be read
- The point in the past must be well defines
- This is useful since Spanner is a multi-version database

### Timestamps + TrueTime

1. Acquire the locks
2. Pick `s = TT.now().latest` - this is a timestamp that's guaranteed to be in the future, so it won't overlap with an existing commit timestamp for data we chose
3. Delay comitting a transaction to wait out the uncertainty $\varepsilon$ (which is why we want $\varepsilon$ to be as low as possible)
4. Wait until `TT.now().earliest > s`, since now the API guarantees our timestamp doesn't overlap with an existing commit - this means we have a total order and can release the lock

### Commit Wait and Replication

1. Acquire the locks
2. Pick `s`
3. Start the Paxos consensus
4. Achieve the Paxos consensus (everyone agrees)
5. Commit wait done
6. Release locks
7. Notify slaves

### Commit Wait and 2-Phase Commit

This is where multiple machines are all involved in a transaction

1. Each machine acquires a lock
2. Each machine picks its own `s`
3. Each machine executes 2PC
4. The machines send their `s` to the master machine
5. Master machine agrees on an overall timestamp `s`, which is associated with the transaction, e.g. the youngest timestamp picked (most recent)
6. Locks are released
7. Participants are notifies of the chosen global `s`

## System Architecture

Spanner is split into zones, where each zone will fail independently (this is usually on the scale of one/few zones per data centre)

There is a universemaster and placement driver over all zones

Each zone has a zonemaster, as well as location proxies and spanservers

## Software Stack

Data is replicated across different data centres

One of these data centres is the leader

Each replica is associated with a Paxos group, a tablet and the data store (Colossus)

This group also has a participant leader, which will talk to other groups' participant leaders if a transaction is done across multiple Paxos groups

This participant leader has a transaction manager and a lock table

## Paxos Algorithm

Paxos is a consensus algorithm

- The leader will receive the client's command
- It then assigns it a new command user i
- It runs the ith instance of the consesus algorithm in parallel

A Paxos group is all of the machines involved in an instance of Paxos

Within a Paxos groups, the leader may fail and need re-election, but the safety properties are always guaranteed

In spanner, tablets are replicated between data centres, and Paxos does the concurrency control between them

A transaction needs to be consistent across all of its replicas, and Paxos coordinates this

A transaction which involves multiple Paxos groups will use the transaction management machinery (participant leader and transaction manager) atop of the leader of the Paxos group to coordinate 2PC

Updates need to be propagated to all members of the Paxos group

If a transaction only involves a single Paxos group, it can bypass the transaction manager and participant leader

## Data Chunks

Data is stored in directories - which are analogous to buckets in [Bigtable](/notes/scalable-systems/bigtable)

- They're the smallest unit of data placement
- They're the smallest unit to define replication properties on

A directory can be sharded into fragments if it grows too large - this is done automatically

## Evaluation

This evaluated replication, transactions and availability

It showed that the more Paxos groups which were involved in committing a transaction, the higher the latency, since 2PC made things more expensive

For availability, it showed that the failure recovery was very good

- If a follower in a Paxos group failed, there was no performance degradation
- If a leader soft-failed (the leader cooperates) - there was no performance degradation
- If a leader hard-failed - there was some degradation, but it recovered well - it relied on timeouts for the followers to realise

$\varepsilon$ is pretty stable, and only increases when the network link goes down, however there is quick recovery
