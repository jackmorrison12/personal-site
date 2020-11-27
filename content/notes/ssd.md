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
  - Storage Hierarchy
  - OLTP
  - OLAP
  - Flash
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

Date enters through an <mark>interface</mark> (e.g. SATA), and into the <mark>internal CPU</mark>

There is a <mark>flash controller</mark>, which manages where in the flash disk the data is stored

Inside of a flash package, we have dies, inside of these we have planes, inside of these we have blocks and finally inside of these are pages

There are <mark>no moving parts</mark>, so not many mechanical limitations, and the <mark>time to access data doesn't depend on location</mark>

The software driver (flash controller) is pretty complex - it places the data on disk and keeps track of how many times each block has been written to, in order to spread this out so that app flash pages degrade at the same pace (wear levelling)

## Accessing a flash page

The <mark>time to access a flash page</mark> depends on:

- <mark>Device organisation</mark> (internal parallelism)
- <mark>Software efficiency</mark> (driver)
- <mark>Bandwidth</mark> of flash packages
- <mark>How many requests</mark> there are

The <mark>flash translation layer</mark> is the <mark>complex device driver</mark>, and it services read/write requests, and tunes the performance and device lifetime, as stated earlier

<mark>Writes are generally slower than reads</mark> (particularly random writes) since we need to copy the content of a page to a new page, and delete the old page

For a serial write, we can keep it into the internal memory until we have a full page, and so do not need to copy and delete

<mark>Deletion takes time and is inefficient</mark>, and we can only delete at block level and not page level, since the devices are so densely packed, and we need to apply a high voltage to erase a page which seeps over into other pages

# SSD vs HDD

| HDD                      | SSD                         |
| ------------------------ | --------------------------- |
| Large                    | Small                       |
| Inexpensive capacity     | Expensive capacity          |
| Inefficient random reads | Very efficient random reads |

# Place in the Storage Hierarchy

Now, for <mark>latency</mark>, the CPU is less than a nanosecond, and the cache & RAM lie below one microsecond. HDDs are above 1 millisecond, and so SSDs are used as the bridge between RAM and HDD (between 1$\mu$s and 1ms)

For <mark>bandwidth</mark>, CPU is around 100GB, RAM is just below, and HDD is around 100MB; SSD is somewhere in the middle of RAM and HDD

SSDs are usually used as a <mark>bridge</mark> between RAM and HDD

This shows that <mark>SSD didn't replace HDD</mark>, but are used in conjunction in database systems

# SSD Today

Commercially, Flash and PCM (Phase-Change Memory) are the only pursued SSDs

Flash is the most developed, however PCM is a promising competitor

Flash:

| Flash Parameter | Status      | Trend   |
| --------------- | ----------- | ------- |
| Density         | Not Enough  | Up :)   |
| Bulk Erase Size | Problematic | Up :(   |
| Access Time     | Good        | Up :\|  |
| Endurance       | Bad         | Down :( |

The <mark>denser we pack flash devices, the more brittle they become</mark>, the more errors they get, and so we need more checksums/error correction code, which take up capacity

You can only erase a block, and so <mark>bulk erase size is problematic</mark>, but getting better

Endurance is bad, and for a highly write-intensive workload it isn't a good choice

PCM:

| PCM Parameter | Status    | Trend  |
| ------------- | --------- | ------ |
| Density       | Too Low   | Up :)  |
| Access Time   | Very Good | Up :\| |
| Endurance     | OK        | ?      |

It doesn't have bulk erase, that's a characteristic of SSD

It <mark>won't replace flash</mark> - it sits somewhere else in the storage hierarchy - they may sit in the same stack

It has <mark>very good access time, but the density is not great</mark>

It'll probable sit somewhere below memory and above HDD

# The current state of DBMSs

DBMSs are designed around the HDD model - they use <mark>optimisations</mark> such as:

- <mark>Data Structures</mark> (B-trees, bitmap indexes, column organisation, compression)
- <mark>Query Plans</mark> (prefer sequential vs random access)
- <mark>Buffer pool</mark>, buffering policies, write-ahead logging
- <mark>Column Stores</mark>
- <mark>Transactions</mark> - as we had to wait for data from disk, so had to run them in parallel

# So... <mark>what do we do with flash?</mark>

We can use it:

- to <mark>replace HDD</mark>
- as an <mark>intermediate layer</mark> in the memory hierarchy
- <mark>side by side</mark> with HDD

But there is <mark>no correct use</mark> - it depends on the workload, dataset size, access pattern etc...

It also depends on the future trends, so how flash evolves, if it becomes more competitive with HDDs

# Flash-only OLTP

<div class="def">
  <span class="is-primary bold">OLTP: </span>Online Transaction Processing
</div>

OLTP I/O is <mark>dominated by random reads/writes</mark>, which is really bad for disks

Random reads/writes are much faster on flash

Usually a couple of flash devices are enough to hold a working set, and the transactions should benefit from the fast random access

<mark>Over time, the throughput decreases</mark> in the worst case for constant random writes, due to the update procedure, where need to do the erasure step stated earlier, which is slower and costly

However, we can re-design this with an algorithm...

## Append/Pack Algorithm

If we have an <mark>append only algorithm</mark>, we write sequentially as much as we can

Each new page is an append, and <mark>we don't do any in-place updates</mark> - we append and invalidate the current page instead

<mark>When we run out of space, we reclaim space and re-organise the storage</mark>, and continue to write the pages

For write-heavy workloads, this turns random writes into sequential writes. It has the <mark>overhead of copying pages/garbage collection</mark>, but it's still a lot more efficient than before

You're just adapting the algorithm to the underlying hardware, like we have many times for HDD, and it gives much better throughput which is much more predictable

# Flash-aided Business Intelligence (OLAP)

<div class="def">
  <span class="is-primary bold">OLAP: </span>Online Analytial Processing
</div>

OLAP are usually read-only, complex queries

So how do we combine these complex queries with scattered updates efficiently?

Traditionally, we had:

- <mark>Freshness</mark>: in-place updates (much slower)
- <mark>Performance</mark>: batch updates (we don't have the freshness)

But ideally, we want no overhead...

... so we use SSDs!

<mark>Incoming updates go into SSD</mark>, then when we want to compute something, we <mark>combine data from disk with updates on SSD and merge join them</mark>

Most of the overhead of the merge is hidden in the latency of the disk, and so it's very efficient

However...

- Random writes are limitations, but we can work around those
- SSDs have a limited number of writes

We do this by a <mark>Materialised Sort-Merge (MaSM)</mark>:

1. The <mark>SSD buffers any incoming updates</mark>
2. Query enters system
3. <mark>Retrieve all data from HDD</mark>
4. Updates on SSD are mirrored onto pages - put these into memory
5. Merge these updates
6. <mark>Merge the data</mark> from disk and the updates from SSD
7. Return the query results

This performs very well with a fine-grained index (which is a way to find the updates)

# Logging on Flash + HDD

Transactional logging is a major bottleneck - we have to flush the redo log to stable storage (SSD)

The log files write out the transactions we're about to execute, so we can recreate that if anything crashes

The <mark>log access pattern is small sequential writes</mark> - this is perfect for SSD over HDD as we have no rotational delay

If it gets too big, you can always move it to disk in one go

# Summary

There are many ways SSDs can be used in databases:

- Helper at the <mark>memory level</mark>
- <mark>Adapt the I/O pattern</mark>, using SSD where it's suitable (especially random reads)
- Change storage management and query optimisations - this is more a research area though

SSDs can help to <mark>bridge the I/O gap</mark>, but we need to be clever in how we use it

We need to <mark>adapt the software to help in using SSDs properly</mark>

Many flash devices are used in data management, especially with graph databases, where there are more random accesses
