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

Spanner is Google's <mark>globally distributed database</mark>

## What is Spanner?

Spanner was the next step from [Bigtable](/notes/scalable-systems/bigtable) in RDBMS evolution with <mark>strong time semantics</mark>: a <mark>distributed multi-version database</mark>

Some of the key features are:

- <mark>General purpose transactions</mark> (ACID)
  - <mark>Externally consistent</mark> global write-transactions with synchronous replication
  - Transactions <mark>across data centres</mark>
  - <mark>Lock-free read-only transactions</mark>
- Schematised, semi-relational data model
  - <mark>SQL-like query interface</mark>

It's currently running in production, providing storage for Google's advertisement data, replacing a manually sharded MySQL database

Its main property is that it has <mark>external consistency</mark> of distributed transactions

- This means <mark>everyone agrees the same external order of transaction execution</mark> using <mark>global timestamps</mark>
- It was the first system of its kind at global scale
- It enables <mark>transaction serialisation</mark> via global timestamps

It's implemented using an integration of <mark>concurrency control, replication and two-phase commit</mark>

- It focuses on <mark>correctness and performance</mark>
- It has <mark>auto-sharding</mark>, <mark>auto-rebalancing</mark> and <mark>automatic failure response</mark>

The enabling technology for all of this is <mark>TrueTime</mark>

- This is an <mark>interval-based global time</mark>
- It <mark>acknowledges clock uncertainty and guarantees a bound on it</mark>, imposing a <mark>total order over timestamps</mark>
- It uses <mark>GPS devices and Atomic clocks</mark> to get an accurate time
- Each <mark>clock maintains an estimate of the worst time inaccuracy</mark> that could exist

## Read Transactions

Using the example of a social network, we may want to generate a page of friends' recent posts

We need a <mark>consistent view</mark> of our friends list and their posts

Consistency is important, since, if someone removes a friend and then posts something, it must be guaranteed the person they removed cannot see the post - if the order is not enforced globally, this could cause issues

On one machine, we could just block all writes, take a consistent snapshot of the database state, and execute the read against the snapshot

However, when using <mark>multiple machines, the snapshots across all machines need to be consistent</mark> - taken at the same time in order ot get a consistent view of the data

With multiple data centres, this is even harder, since there are <mark>high latencies between data centres</mark>, and so it's hard to reason about snapshot consistency

Therefore, we need external consistency - this means we have a consistent view of the database

- This a <mark>synchronised snapshot read of the database</mark>
- The <mark>effect of past transactions should be seen</mark> and the <mark>effect of future transactions should not be seen</mark> across all data centres

It's equivalent to linearisability

If transaction $T1$ commits before another transaction $T2$ starts, then $T1$'s commit timestamp is smaller than $T2$'s

Any read that sees $T2$ must see $T1$

It's the <mark>strongest consistency guarantee which can be achieved in practice</mark>

Transactions that write use strict <mark>two phase locking (2PL)</mark>

Each transaction $T$ is assigned a timestamp $s$, and data written by $T$ is timestamped by $s$

To synchronise snapshot, we use <mark>global wall-clock time</mark>

External Consistency therefore means:

- <mark>Commit order respects the global wall-time order</mark>
- Timestamp order respects the global wall-time order

Since the timestamp order is equal to the commit order

## Read-Write Transaction

Read locks are used on all data items what have been read

- This is so a <mark>consistent snapshot is read</mark>
- The locks are acquired at the leader
- They <mark>read the latest version</mark>, not based on the timestamp

<mark>Writes are buffered</mark>, and <mark>acquire write locks at commit time</mark> (when the preparation is done)

The timestamp is assigned at commit time, based on globally-ordered timestamps, and the data version is written with the commit timestamp

Write transactions follow a strict 2PL - the <mark>timestamp must be assigned while the locks are held</mark>

The <mark>timestamp is in the range from when locks are acquired to when they're released</mark> - this is the definitive time this transaction was committed, and its effects will be visible in the system after the locks are released

The <mark>timestamp order respects the global wall-time order</mark>, so the timestamp order is equal to the commit order

## Clock Skew

Typically in distributed systems, there is no global clock

Individual nodes have local clocks which have clock skew

This means the timestamps lead to a partial order,

## TrueTime

This is the <mark>novel API</mark> behind Spanner's core innovation

It leverages hardware features such as <mark>GPS and Atomic Clocks</mark>

They key methods in the API is <mark>`now()`</mark>: it not only returns the <mark>current system time</mark>, but also a value ($\varepsilon$) which tells the <mark>maximum uncertainty</mark>

Each data centre has a set of <mark>time master servers</mark>, and <mark>machines have time slave daemons</mark>

The majority of time masters are fitted with GPS clocks, and a few others called Armageddon masters are fitted with atomic clocks

The <mark>daemon polls a variety of masters</mark> and reaches a <mark>consensus about the correct timestamp</mark> - it syncs the clocks and uses the uncertainty to narrow down the actual time

Both GPS and Atomic clocks are used since they have different failure rates and scenarios - this reduces uncertainty

There are also two more API methods, which return booleans:

- `After(t)` - returns `True` if `t` is definitely passed
- `Before(t)` - returns `True` if `t` is definitely not arrived

These both <mark>take into account uncertainty</mark>

TrueTime uses these methods in concurrency control, and to serialise transactions

Therefore, the final results ia "Global wall-clock time" with bounded uncertainty

### TrueTime-supported Transactions

<mark>Read-Write - requires locks</mark>

<mark>Read-only - lock free</mark>

- Requires a consistent snapshot of the data
- Requires declaration before start of transaction
- Reads information that is up-to-date

Snapshot-read - <mark>read information from the past</mark> by specifying timestamp or bound

- Use specific timestamp from the past or timestamp bound so that data until that point will be read
- The point in the past must be well defined
- This is useful since Spanner is a <mark>multi-version database</mark>

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

Spanner is split into <mark>zones</mark>, where <mark>each zone will fail independently</mark> (this is usually on the scale of one/few zones per data centre)

There is a universemaster and placement driver over all zones

Each zone has a zonemaster, as well as location proxies and spanservers

## Software Stack

Data is replicated across different data centres

<mark>One of these data centres is the leader</mark>

Each replica is associated with a <mark>Paxos group</mark>, a tablet and the data store (Colossus)

This group also has a <mark>participant leader</mark>, which will talk to other groups' participant leaders if a transaction is done across multiple Paxos groups

This participant leader has a transaction manager and a lock table

## Paxos Algorithm

Paxos is a <mark>consensus algorithm</mark>

- The leader will receive the client's command
- It then assigns it a new command user $i$
- It runs the $i$th instance of the consensus algorithm in parallel

A <mark>Paxos group</mark> is <mark>all of the machines involved in an instance of Paxos</mark>

Within a Paxos groups, the leader may fail and need re-election, but the safety properties are always guaranteed

In spanner, <mark>tablets are replicated between data centres</mark>, and <mark>Paxos does the concurrency control</mark> between them

A <mark>transaction needs to be consistent across all of its replicas</mark>, and Paxos coordinates this

A transaction which involves multiple Paxos groups will use the <mark>transaction management machinery</mark> (participant leader and transaction manager) atop of the leader of the Paxos group to coordinate 2PC

Updates need to be <mark>propagated to all members of the Paxos group</mark>

If a transaction only involves a <mark>single Paxos group</mark>, it can <mark>bypass the transaction manager and participant leader</mark>

## Data Chunks

Data is stored in <mark>directories</mark> - which are analogous to buckets in [Bigtable](/notes/scalable-systems/bigtable)

- They're the <mark>smallest unit of data placement</mark>
- They're the <mark>smallest unit to define replication properties on</mark>

A <mark>directory can be sharded into fragments</mark> if it grows too large - this is done <mark>automatically</mark>

## Evaluation

This evaluated replication, transactions and availability

It showed that the <mark>more Paxos groups</mark> which were involved in committing a transaction, the <mark>higher the latency</mark>, since 2PL made things more expensive

For availability, it showed that the failure recovery was very good

- If a <mark>follower</mark> in a Paxos group failed, there was <mark>no performance degradation</mark>
- If a <mark>leader soft-failed</mark> (the leader cooperates) - there was <mark>no performance degradation</mark>
- If a <mark>leader hard-failed</mark> - there was <mark>some degradation</mark>, but it recovered well - it relied on timeouts for the followers to realise

<mark>$\varepsilon$ is pretty stable</mark>, and only increases when the network link goes down, however there is quick recovery
