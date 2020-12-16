---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Main Memory Indexing
slug: main-memory-indexing
topic: 1.2
hidden: false
tags:
  - Main Memory Indexing
  - Cache
  - B+ Trees
---

# Trends of Hardware

Currently, <mark>CPU speed and memory capacity</mark> can <mark>double every 18 months</mark>

However, the <mark>performance</mark> of main memory <mark>doesn't keep up</mark> at the same pace - it only grows at about <mark>10% a year</mark>

So the gap grows by about 10x every 6 years!

This means that many <mark>databases can fit in main memory</mark>, but <mark>memory access is the new bottleneck</mark> for this

We also no longer have a uniform random access model, so we can no longer assume accessing each piece of data in main memory takes the same amount of time

<mark>Cache performance has also become crucial</mark>

# Memory Basics

## Heirarchy

The top few levels of the memory hierarchy are:

| Type               | Cycles | Size        | Cache Line Size  |
| ------------------ | ------ | ----------- | ---------------- |
| CPU                |        |             |                  |
| L1 Cache (on chip) | 1      | 8-64 KB     | 32 byte/line     |
| L2 Cache           | 2-10   | 64KB - x MB | 64-128 byte/line |
| TLB                | 10-100 | 64 Pages    |                  |

As you go <mark>higher</mark>, <mark>the bandwidth increases</mark>, but the <mark>latency and size decrease</mark>

The <mark>cache line is the smallest unit you can retrieve from the cache</mark>, and so if you have a data structure, you try to align it so it fits on a (multiple of a) cache line

Cache is <mark>restricted by price/performance</mark>

<mark>Cache performance is crucial</mark> - it's similar to a disk cache, but the DBMS has no direct control

## How to Improve Cache Behaviour

Some factors which affect cache behaviour are:

- The <mark>cache (TLB) capacity</mark>
- <mark>Locality</mark> (temporal and spatial)

To improve the locality therefore:

- Have non-random access, by <mark>clustering to a (multiple of a) cache line</mark>, and <mark>squeezing more useful data into a cache line</mark>
- Avoid random access, like in a hash join, so partitions fit in the TLB
- Trade CPU for memory access, by <mark>compressing things</mark> and using the CPU to decompress them (similar to spacial data)

# Cache Conscious Indexing

## B Trees

Each node in the tree can hold <mark>2 entries</mark>

For the <mark>root and non-leaf nodes</mark>, these are <mark>two values</mark>, $v1$ and $v2$, and also <mark>three pointers</mark>, $p1$, $p2$, $p3$, where $p1$ points to a node where all of the contained values are lower than $v1$, $p2$ points to a node where all contained values are between $v1$ and $v2$, and $p3$ points to a node where all contained values are larger than $v2$

When you get to the <mark>leaf nodes</mark>, they contain just <mark>two values</mark>. Values in all nodes are pointers with that specific key, which <mark>point to a value somewhere in memory</mark>

## B+ Trees

The difference between B Trees and B+ Trees are that <mark>all values are stored in the leaf nodes</mark>, and the <mark>leaf nodes are connected</mark>. This means it's very <mark>efficient to execute range queries</mark>, as you don't need to traverse back up and down the tree to find the next nodes.

Some key points are that:

- They're <mark>balanced</mark>, so the leaves are all at the same level, and so we have a predictable performance
- Every node, except the root, needs to be <mark>at least half full</mark> in order to keep it balances
- The <mark>order</mark> is the <mark>minimum number of keys/pointers in a non-leaf node</mark>
- The <mark>fanout</mark> of a node are the <mark>number of pointers coming out of the node</mark>

Some important features:

- <mark>Searching is $\log_d n$</mark>, where $d$ is the order and $n$ is the number of entries
- <mark>Insertion</mark> has a similar cost to searching (O(height)). To insert, you find the leaf to insert into, if it's full, split the node and rebalance
- <mark>Deletion</mark> is similar to insertion - find the leaf node and delete. If it's no longer full, rebalance by merging

## Cache Sensitive Search Tree

This is essentially a <mark>B+ Tree optimised for main memory</mark>

The key is to <mark>improve locality</mark>

<mark>Each node should fit exactly on an L2 cache line</mark>, since the penalty for L2 cache misses is very high compared to L1, but you can fit more nodes than in L1 since it's cache line is so small

To increase fan-out:

- Convert <mark>variable length keys to fixed length</mark> via dictionary compression
- <mark>Eliminate child pointers</mark>, so storing children in a fixed size array, numbering nodes and store them level by level, left to right, and the position of a child can be calculated by arithmetic. This way we only need one pointer: to the array

We try to <mark>fit as many nodes into a cache line as possible</mark> in order to have as few cache misses as possible

### Performance Considerations

- We get <mark>slightly faster search then the B+ tree</mark>, as the tree is now smaller
- The <mark>space is about half of a B+ tree</mark>
- Has a <mark>very good search/space balance</mark> (the only ones which do better in one aspect do very poorly in the other)

However, the problem is that we <mark>can't have dynamic updates</mark>, since fan-out and array size are fixed

## CSB+ Trees

So they way to address the problems with CCS trees are with a CSB+ tree, which have the key features:

- <mark>Children of the same node are stored in an array</mark>
- The <mark>parent node</mark> only has a <mark>pointer to the child array</mark>
- It has similar search performance to the CSS tree
- It also has <mark>good update performance</mark>, as long as there is no split, which can be done by leaving space in the nodes

It's not really much better than a cache-aligned B+ tree, and so they aren't really used in industry

### Other Variants of CSB+ Trees

CSB+ trees with segments:

- These <mark>divide the child array into segments</mark>
- One child pointer per segment
- <mark>Better split performance</mark>, <mark>worse search</mark>

Full CSB+ Tree:

- CSB+ tree with <mark>pre-allocated child array</mark>
- <mark>Good for search and insertion</mark>, but <mark>uses more space</mark> as every child array is already allocated no matter how much data we store

## Performance of Cache Conscious Indexing

Search: CSS < full CSB+ ~ CSB+ < CSB+ seg < B+
Insertion: B+ ~ full CSB+ < CSB+ seg < CSB+ < CSS

So full CSB+ wins if space is not a concern

CSB+ and CSB+ seg win if reads matter more than insertions

CSS is best for a read-only environment

As you can see, it <mark>depends on the use case</mark>!

# Cache Conscious Join Method

## Vertical Decomposed Storage

We <mark>partition a base table into arrays</mark> (one array per attribute)

Each array stores the <oid, value> pairs for the ith attribute

Variable length fiends are converted to fixed length fields via dictionary compression

We can <mark>omit the oid if it is dense and ascending</mark>

<mark>Reconstruction is cheap</mark> - it's just an array access

## Existing Equal-Join Methods

<mark>Sort-merge</mark>:

- This is bad, since usually one relation won't fit in the cache, and then you need to keep reading things into the cache

<mark>Hash-join</mark>:

- This is bad if the inner relation can't fit in the cache

<mark>Clustered hash join</mark>:

- There is one pass to generate the cache-sizes partitioned
- It's bad if the number of partitions exceeds the number of cache lines or TLB entries, as we have TLB/cache thrashing

<mark>Radix join</mark>:

We <mark>partition the whole dataset</mark> so we have matching partitions based on the bit patterns of the first few bits of the join attribute

We then <mark>join the matching partitions</mark>, using a nested loop for small partitions, or a hash join for larger partitions

This <mark>avoids cache/TLB thrashing</mark>, since the fan out of each partition generated doesn't exceed the number of cache lines and TLB entries

This therefore <mark>saves on cache misses</mark>, and so beats conventional join methods, as cache misses have a higher impact than the extra partitioning cost

## Learnings

1. <mark>Cache performance</mark> is important

2. We need to improve locality by caching data into a cache line, leaving out irrelevant data, and partitioning to avoid cache and TLB thrashing

3. However... we must <mark>make code efficient</mark> to observe these improvements!

# Spatial Data

This is <mark>data with 2 or 3 dimensions</mark>, e.g. points

This means queries like nearest neighbour/range are different to usual...

We need to <mark>store objects near to each other on the same disk page</mark>. However, this is hard in multiple dimensions as there is not a total order

On disk, 97% of time is spent reading data from disk. However, in main memory, 95% of time on spatial data queries is spent on computation, and so this is something different we need to optimise now!

## How to reduce spatial data computations

Have <mark>non-uniform partitions</mark>, e.g. have 3 pieces of data in a partition, no matter how spread out they are, so they may not be the same size

This means, to execute a query on them, we need to <mark>figure out which partitions it intersects with</mark>. This can be really time consuming - it's unnecessary computations

One way to change this is to use a <mark>uniform grid</mark> instead. We can therefore check which grid cell it interacts with most, and run the query on that cell. Then for the leftovers, we can make the grid more fine-grained, and then find which cell it intersects with the most, and repeat again, down to a level where the grid is so fine grained that it covers our range

This <mark>reduces the number of unnecessary comparisons</mark> and therefore the amount of unnecessary computation

We can also do <mark>lossy compression of spatial data</mark>, which is where we drop precision of our objects, and do this so that the resulting objects become bigger. This means that we won't be messing up the result, we may just have a little but of extra computation. But by quantising the data, we align with a grid, and therefore there is a smaller representation of data in main memory, and so more data can fit
