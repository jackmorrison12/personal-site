---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Bigtable
slug: bigtable
topic: 8
hidden: false
tags:
  - Bigtable
  - Google
---

Bigtable is a Distributed Storage System for Structured Data, developed by Google

## Why Bigtable?

Google has lots of data which needs storing and processing, for example: web, satellite and user data

They also have many incoming requests coming for all of their services at any time

No commercial database system is big enough to handle this - even if there was, it would be extremely expensive, and may not have the best design choices for them, so they made Bigtable

## Building Blocks

Some of the key building blocks used in Bigtable were:

- Scheduler (Google WorkQueue)
- Google File System
- Chubby Lock Service

Some other pieces which run on tup of BigTable and are useful are:

- Sawzall (declarative queries over data)
- [MapReduce](/notes/scalable-systems/mapreduce)

Using all of these building blocks, Bigtable buit a more application-friendly storage service

### Google File System

This is a large-scale distributed file system, which stores the actual data in CSSTables

It has a master, which is responsible for metadata

It also has chunk servers, which are responsible for reading and writing large chunks of data

Chunks are replicated on 3 machines, with the master responsible for ensuring that replicas exist

If a failure occurs and a replica is lost, then the master will pick a new chunk server and create a replica on that server

### Chubby

This is a locking/file/naming service

It gives a distributed system access to some strongly consistent configuration data that the service requires

It's a strongly consistent data store

It has coarse-grained locks, where a small amount of data can be stored in a lock

Each lock has 5 replicas, with a majority vote needed for them to be active

It uses more replicas so that data loss doesn't happen in practice, as data is crucial

## Data model: A Big Map

Bigtable is essentially a very large key-value store

It has a 3-value key, consisting of: `<Row, Column, Timestamp>`

Each value is an uninterpreted array of bytes - no other data types are supported

Each row has arbitrary columns, so there is no fixed schema

Columns are split into column families, which have the format `family:qualifier` - these families are stored close together to have good locality

The family is heavyweight, and the quantifier is lightweight

This means it's a column-oriented data store - rows are sparse

It also has a lookup, insert and delete API, where each read or write of data under a single row key is atomic - this means multiple columns of the same row can be updated in one transaction

## Comparison to a Relational Database

- Bigtable has no table-wide integrity constraints
- There are no multi-row transactions
- The values are uninterpreted, which means there can be no aggregation over data (e.g. sum)
- Immutable data (similar to versioning DBs) - timestamps are used to tell the difference
  - It can be specified to either keep the last $N$ versions or last $N$ days, and the rest is garbage collected
- C++ functions are used, not SQL
- Clients indicate which data to cache in memory
- Data is stored lexicographically sorted
  - Clients control locality by the naming of the rows and columns

## SSTable

These are an abstraction used to store data

They're an immutable, sorted file of key-value pairs

They consist of chunks of fixed-size (64KB) data and an index

- The index is of block ranges, not values
- The index is loaded into memory when the SSTable is opened
- Lookup is a single disk seek using the given key

Another alternative is to load the SSTable into memory, so there is no disk lookup

## Tablet

A tablet is a group of SSTables

It contains some range of tows of a table, from a start value to an end value (since values are sorted)

It's a unit of distribution and load balancing

## Table

Multiple tablets make up a table

SSTables can be shared between tables

Tablets do not overlap, however SSTables may overlap (belong to two tables)

For example, one tablet may index keys from `aardvark` to `apple` and another from `applea` to `boat`

`apple` and `applea` can be on the same SSTable, however they're on different tablets

### Finding a Tablet

The storage system is used to store it's own metadata - the job is to store user tables and metadata associated with those tables

A root chubby file is used to find the root tablet, and then there is a hierarchical organisation which is traversed to find the appropriate user table

The client library caches tablet locations, in order to prevent Chubby from becoming a bottleneck

A metadata table includes the log of all events pertaining to each tablet

## Servers

Tablet servers manage tablets, and there are multiple tablets per server

- Each tablet is 100-200MBs
- Each tablet lives at only one server
- Tablet servers split tablets which get too big

The master server is also responsible for load balancing and fault tolerance

- It uses Chubby to monitor the health of tablet servers, and restarts failed servers
  - If there is a particularly popular tablet, then the tablet server will be getting a lot of requests to it and potentially may be come overloaded
  - therefore, it gives tablets to other servers, or even splits big tablets if this happens
  - This is efficient since SSTables are immutable, and so nothing needs to be rewritten, just some pointers shuffled
- GFS handles data replication
- It's preferred to start a tablet server on the same machine the data is already at, since local IO operations are faster than network ones

Tablet servers are stateless

- There is a mapping to tablets in the metadata
- A new server can therefore easily take over if one fails

## Editing/Reading a Table

Mutations are committed to a commit log in GFS (which is a sequential file)

- They are then applied to an in-memory version called a memtable
- A memtable needs to be kept sorted, and so it's in memory as it's cheaper to do this in memory
- For concurrency, each memtable row is copy-on-write
- This is for fault-tolerance - a mutation should write to the commit log and THEN input into memtable
- It can be used to rebuild on failure

Reads are applied to a merged view of SSTables and memtables

- Reads are more expensive than writes
- Reads and writes continue during a tablet split or merge
- Reads have to access SSTables and memtables since the latest version of a key could be in either

## Compactions

### Minor Compaction

This is where a full memtable is converted into an SSTable, and a new memtable is started

- This reduces memory usage
- It also reduces log traffic on restart, as the commit log can be discarded after disk write
- The memtable is essentially just written to disk

### Merging Compaction

This is where several overlapping SSTables are picked and new SSTables are written out without the overlap

- This reduces the number of SSTables
- It's a good place to apply the "keep only N versions/for N days" policy, since it can garbage collect keys with timestamps older than the threshold, or where there are too many versions

### Major Compaction

This is a merging compaction which only results in one SSTable

There are no deletion records, only live data

This is done on very popular keys with lots of updates, since the key range will get messy, and this compaction shrinks the key range

## Locality Groups

Column families are grouped together into SSTables

- This avoids mingling data, i.e. page contents and page metadata
- Some frequently accessed locality groups can be kept in memory

Some locality groups can be compressed (sometimes 10:1 compression)

- Since the data is similar, it should compress well, e.g. in different versions of the same HTML page, there are repeated strings
- Some popular compression schemes are:
  - Long common strings across a large window
  - Standard compression across small 16KB windows

Bloom filters are applied on locality groups

- These are a probabilistic data structure for set membership to quickly decide where data lives
- This avoids having to search the SSTable

## Microbenchmarks

### Throughput

| Experiment         | 1 tablet server | 50 tablet servers | 250 tablet servers | 500 tablet servers |
| ------------------ | --------------- | ----------------- | ------------------ | ------------------ |
| random reads       | 1212            | 593               | 479                | 241                |
| random reads (mem) | 10811           | 8511              | 8000               | 6250               |
| random writes      | 8850            | 3745              | 3425               | 2000               |
| sequential reads   | 4425            | 2463              | 2625               | 2469               |
| sequential writes  | 8547            | 3623              | 2451               | 1905               |
| scans              | 15385           | 10526             | 9524               | 7843               |

Each number here are the number of requests executed per server per second

This shows that sequential and random writes are significantly faster than reads

This is because a read needs to read the SSTable and memtable, and may need to merge results

When data is cached in memory, there is a much higher throughput for random reads, since it doesn't need to merge with the SSTable

Scans take advantage of the fact data is sorted and so it can read it linearly

### Aggregate Rate

Scans and random reads scale well with the number of tablet servers

Everything else does not, since they need to involve more SSTables and potentially have to combine them

Random reads scale especially badly - they access a small amount of data, but since the block size if 64KB, they still retrieve 64KB of data even though they need less, and so the network is the bottleneck

## Lessons Learned

- Only implement some of the requirements, since the last ones are probably not needed
  - This allows for better scalability and a simpler design
  - Only implement things you strictly need, not things like multi-row transactions
- There are many types of failure possible
  - GFS replication and Chubby replication are used
- Big systems need proper systems-level monitoring
  - This is provided by Chubby
- There is value in simple designs
  - Immutable sorted data
  - Separation of data and metadata
  - Assignment of data to different servers in a flexible way to allow load balancing
