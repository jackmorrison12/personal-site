---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: RDDs
slug: rdds
topic: 12
hidden: false
tags:
  - RDDs
  - Spark
---

Resilient Distributed Datasets are a fault-tolerant abstraction for in-memory cluster computing

## Motivation

MapReduce greatly simplified big data analysis on large unreliable clusters

But as soon as it became popular, people wanted more:

- More complex, multi stage applications (e.g. iterative ML and graph processing)
- More interactive ad-hoc queries - use notebook-style interaction

Complex apps and interactive queries both need efficient primitives for data sharing, which MapReduce lacks

In MapReduce the only way to share data across jobs is through stable storage (GFS), which is very slow due to high IO costs

However, MapReduce relies on this for fault tolerance

## In-Memory Data Sharing

This is where for intermediate values, the disk is replaced with memory

It took advantage of the decreasing cost of main memory at the time, so the whole dataset could be kept in memory

It was 10-100x faster then network & disk, but it's harder to make fault tolerant...

To design a distributed memory abstraction which is both fault-tolerant and efficient, the most common ideas were:

- Interfaces based on fine0grained updates to mutable state
- Replicating data or logs across nodes for fault tolerance, which is costly for data-intensive apps, and 10-100x slower than a memory write

These weren't good enough for the purpose of Spark, so the answer was therefore RDDs...

## RDDs

The idea of RDDs was to store the data lineage instead of the data, and then recompute it based on the lineage if there was a fault

The lineage is the computation steps which had to be computed to obtain a specific dataset

RDDs are:

- Partitioned across nodes (sharded data structure)
- Immutable, to simplify lineage tracking (lineage always correct)
- Can only be built through coarse-grained deterministic transformations (map, filter, join...)
- Checkpointing to disk, to avoid unbounded lineage

This enables efficient in-memory processing, which is orders of magnitude faster than iterative algorithms

## RDD Recovery

If we lose the memory contents, we need to recompute the data we lost, which can be done by using the lineage

Checkpointing is useful so we don't need to recompute the whole lineage

Recover happens at the granularity of specific partitions of the RDD

## Generality of RDDs

RDDs can express many parallel programs which naturally apply the same operation to multiple items

They unify many current programming models

- Data flow models such as MapReduce, Dryad and SQL
- Specialised models for iterative apps, such as BSP, iterative MapReduce

They also support new apps which these models do not support

## Tradeoff Space

RDDs have a very high write throughput, near the memory bandwidth, however have a pretty coarse granularity of updates

This means they are best for batch workloads (OLAP)

Key-Value stores on the other hand, are better for transactional workloads

## Spark Programming Interface

Spark uses an APi in the Scala language

It's usable interactively from the Scala interpreter

It provides:

- RDDs
- Operations on RDDs: transformations (building new RDDs) and actions (computing and outputting results)
- Control of each RDDs partitioning (layout across nodes) and persistence (storage in RAM/on disk)

## Example: Log Mining

An example is loading error messages from a log into memory, and then interactively searching for various patterns

Some example code would be:

```
lines = spark.textFile("hdfs://...)

// transformations on RDD 'lines' - since no result needed, they're not actually executed yet
errors = line.filter(_.startsWith("ERROR"))
messages = errors.map(_.split('\t')(2))
messages.persist()

// actions - the program is now actually executed
messages.filter(_.contains("foo")).count
messages.filter(_.contains("bar")).count
```

The result is that, on 1TB of data, this takes around 5-7 seconds, vs 170 seconds for on-disk data

## Fault Recovery

RDDs track the graph of transactions which build them - their lineage - to rebuild lost data

For example, the RDD messages:

```
messages = textFile(...).filter(_.contains("error")).map(_.split('\t')(2))
```

Would generate a HadoopRDD, then a FilteredRDD, then a MappedRDD, which are all stored in the lineage

The results show that when a failure happens, it can be rectified in that iteration pretty quickly and not affect another interaction

## Example: PageRank

1. Start each page with a rank of 1
2. On each iteration, update each page's rank to $\sum_{i \in neighbours} \frac{i.rank}{|neighbours|} $

The example code would be:

```
links = // RDD of (url, neighbours) pairs
ranks = // RDD of (url, rank) pairs

for (i <- 1 to ITERATIONS) {
  ranks = links.join(ranks).flatMap {
    (url, (links, rank)) =>
      links.map(dest => (dest, rank/links.size))
  }.reduceByKey(_ + _)
}
```

### Optimising Placement

`links` and `ranks` are repeatedly joined

Therefore, we can co-partition them, e.g. hash both on the URL, to avoid shuffles

We can also use app knowledge, so hash on the DNA name

This can be done by adding the line:

```
links = links.partitionBy(new URLPartitioner())
```

This therefore means that if a node fails, then only the partition which has that one partition of the has on needs to be rebuilt, as other partitions don't rely on it for their lineage

### Performance

The time per iteration of PageRank was:

- 171 seconds in Hadoop - needs to materialise results and write them to disk
- 72 seconds on Basic Spark
- 23 seconds on Spark with co-partitioning - faster as joins can be executed more efficiently
