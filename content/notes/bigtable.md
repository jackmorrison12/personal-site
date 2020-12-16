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

Bigtable is a <mark>Distributed Storage System for Structured Data</mark>, developed by Google

## Why Bigtable?

Google has <mark>lots of data</mark> which needs storing and processing, for example: <mark>web, satellite and user data</mark>

They also have <mark>many incoming requests</mark> coming for all of their services at any time

No commercial database system is big enough to handle this - even if there was, it would be extremely expensive, and may not have the best design choices for them, so they made Bigtable

## Building Blocks

Some of the key building blocks used in Bigtable were:

- <mark>Scheduler</mark> (Google WorkQueue)
- Google <mark>File System</mark>
- Chubby <mark>Lock Service</mark>

Some other pieces which run on tup of BigTable and are useful are:

- Sawzall (declarative queries over data)
- [MapReduce](/notes/scalable-systems/mapreduce)

Using all of these building blocks, Bigtable built a more application-friendly storage service

### Google <mark>File System</mark>

This is a large-scale distributed file system, which <mark>stores the actual data in CSSTables</mark>

It has a <mark>master</mark>, which is <mark>responsible for metadata</mark>

It also has <mark>chunk servers</mark>, which are responsible for <mark>reading and writing large chunks of data</mark>

Chunks are replicated on <mark>3 machines</mark>, with the master responsible for ensuring that replicas exist

If a <mark>failure occurs</mark> and a replica is lost, then the <mark>master will pick a new chunk server</mark> and create a <mark>replica on that server</mark>

### Chubby

This is a <mark>locking/file/naming service</mark>

It gives a <mark>distributed system access</mark> to some <mark>strongly consistent configuration data</mark> that the service requires

It's a strongly consistent data store

It has <mark>coarse-grained locks</mark>, where a small amount of data can be stored in a lock

Each <mark>lock has 5 replicas</mark>, with a majority vote needed for them to be active

It uses more replicas so that data loss doesn't happen in practice, as data is crucial

## Data model: A Big Map

Bigtable is essentially a <mark>very large key-value store</mark>

It has a 3-value key, consisting of: <mark>`<Row, Column, Timestamp>`</mark>

Each <mark>value is an uninterpreted array of bytes</mark> - no other data types are supported

Each <mark>row has arbitrary columns</mark>, so there is <mark>no fixed schema</mark>

Columns are split into <mark>column families</mark>, which have the format <mark>`family:qualifier`</mark> - these families are <mark>stored close together to have good locality</mark>

The family is heavyweight, and the quantifier is lightweight

This means it's a <mark>column-oriented data store - rows are sparse</mark>

It also has a <mark>lookup, insert and delete API</mark>, where <mark>each read or write of data under a single row key is atomic</mark> - this means multiple columns of the same row can be updated in one transaction

## Comparison to a Relational Database

- Bigtable has <mark>no table-wide integrity constraints</mark>
- There are <mark>no multi-row transactions</mark>
- The <mark>values are uninterpreted</mark>, which means there can be no aggregation over data (e.g. sum)
- Immutable data (similar to versioning DBs) - timestamps are used to tell the difference
  - It can be specified to either keep the <mark>last $N$ versions or last $N$ days</mark>, and the rest is garbage collected
- C++ functions are used, not SQL
- <mark>Clients indicate which data to cache</mark> in memory
- Data is stored <mark>lexicographically sorted</mark>
  - Clients control locality by the naming of the rows and columns

## SSTable

These are an abstraction used to <mark>store data</mark>

They're an <mark>immutable, sorted file of key-value pairs</mark>

They consist of <mark>chunks of fixed-size</mark> (64KB) data and an <mark>index</mark>

- The <mark>index is of block ranges</mark>, not values
- The <mark>index is loaded into memory</mark> when the SSTable is opened
- <mark>Lookup is a single disk seek</mark> using the given key

Another alternative is to load the SSTable into memory, so there is no disk lookup

## Tablet

A <mark>tablet is a group of SSTables</mark>

It contains some <mark>range of tows of a table</mark>, from a start value to an end value (since values are sorted)

It's a <mark>unit of distribution and load balancing</mark>

## Table

<mark>Multiple tablets</mark> make up a table

<mark>SSTables can be shared</mark> between tables

Tablets <mark>do not overlap</mark>, however SSTables may overlap (belong to two tables)

For example, one tablet may index keys from `aardvark` to `apple` and another from `applea` to `boat`

`apple` and `applea` can be on the same SSTable, however they're on different tablets

### Finding a Tablet

The storage system is used to <mark>store it's own metadata</mark> - the job is to store user tables and metadata associated with those tables

A <mark>root chubby file</mark> is used to find the root tablet, and then there is a <mark>hierarchical organisation</mark> which is traversed to find the appropriate user table

The client library <mark>caches tablet locations</mark>, in order to prevent Chubby from becoming a bottleneck

A metadata table includes the log of all events pertaining to each tablet

## Servers

Tablet servers manage tablets, and there are multiple tablets per server

- Each <mark>tablet is 100-200MB</mark>
- Each <mark>tablet lives at only one server</mark>
- <mark>Tablet servers split tablets</mark> which get too big

The <mark>master server</mark> is also responsible for <mark>load balancing and fault tolerance</mark>

- It uses <mark>Chubby to monitor the health of tablet servers</mark>, and restarts failed servers
  - If there is a particularly <mark>popular tablet</mark>, then the tablet server will be getting a lot of requests to it and potentially may be come overloaded
  - Therefore, it <mark>gives tablets to other servers</mark>, or even <mark>splits big tablets</mark> if this happens
  - This is <mark>efficient since SSTables are immutable</mark>, and so nothing needs to be rewritten, just some pointers shuffled
- <mark>GFS handles data replication</mark>
- It's preferred to start a <mark>tablet server on the same machine the data is already at</mark>, since local IO operations are faster than network ones

<mark>Tablet servers are stateless</mark>

- There is a <mark>mapping to tablets in the metadata</mark>
- A new server can therefore easily take over if one fails

## Editing/Reading a Table

Mutations are committed to a <mark>commit log in GFS</mark> (which is a sequential file)

- They are <mark>then applied to an in-memory version called a memtable</mark>
- A memtable needs to be <mark>kept sorted</mark>, and so it's in memory as it's <mark>cheaper to do this in memory</mark>
- For concurrency, each <mark>memtable row is copy-on-write</mark>
- This is for <mark>fault-tolerance</mark> - a mutation should write to the commit log and THEN input into memtable
- It can be used to <mark>rebuild on failure</mark>

<mark>Reads</mark> are applied to a <mark>merged view of SSTables and memtables</mark>

- Reads are <mark>more expensive</mark> than writes
- Reads and writes continue during a tablet split or merge
- Reads have to access SSTables and memtables since the latest version of a key could be in either

## Compactions

### Minor Compaction

This is where a <mark>full memtable is converted into an SSTable</mark>, and a <mark>new memtable is started</mark>

- This <mark>reduces memory usage</mark>
- It also reduces log traffic on restart, as the commit log can be discarded after disk write
- The memtable is essentially just written to disk

### Merging Compaction

This is where <mark>several overlapping SSTables are picked</mark> and <mark>new SSTables are written out without the overlap</mark>

- This reduces the number of SSTables
- It's a good place to apply the "keep only N versions/for N days" policy, since it can garbage collect keys with timestamps older than the threshold, or where there are too many versions

### Major Compaction

This is a <mark>merging compaction which only results in one SSTable</mark>

There are <mark>no deletion records, only live data</mark>

This is done on very popular keys with lots of updates, since the key range will get messy, and this compaction shrinks the key range

## Locality Groups

<mark>Column families are grouped together into SSTables</mark>

- This avoids mingling data, i.e. page contents and page metadata
- Some frequently accessed locality groups can be kept in memory

Some <mark>locality groups can be compressed</mark> (sometimes 10:1 compression)

- Since the data is similar, it should compress well, e.g. in different versions of the same HTML page, there are repeated strings
- Some popular compression schemes are:
  - Long common strings across a large window
  - Standard compression across small 16KB windows

<mark>Bloom filters</mark> are applied on locality groups

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

This shows that <mark>sequential and random writes are significantly faster than reads</mark>

This is because a<mark> read needs to read the SSTable and memtable</mark>, and may need to <mark>merge results</mark>

When <mark>data is cached in memory</mark>, there is a <mark>much higher throughput for random reads</mark>, since it doesn't need to merge with the SSTable

<mark>Scans</mark> take advantage of the fact <mark>data is sorted</mark> and so it can read it linearly

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
