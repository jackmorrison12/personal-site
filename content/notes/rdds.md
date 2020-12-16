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

Resilient Distributed Datasets are a <mark>fault-tolerant abstraction for in-memory cluster computing</mark>

## Motivation

MapReduce greatly simplified big data analysis on large unreliable clusters

But as soon as it became popular, people wanted more:

- <mark>More complex, multi stage applications</mark> (e.g. iterative ML and graph processing)
- More interactive ad-hoc queries - use <mark>notebook-style interaction</mark>

Complex apps and interactive queries both need <mark>efficient primitives for data sharing</mark>, which MapReduce lacks

In MapReduce the only way to <mark>share data across jobs</mark> is through <mark>stable storage</mark> (GFS), which is very <mark>slow due to high IO costs</mark>

However, MapReduce relies on this for fault tolerance

## In-Memory Data Sharing

This is where for <mark>intermediate values</mark>, the <mark>disk is replaced with memory</mark>

It took advantage of the decreasing cost of main memory at the time, so the whole dataset could be kept in memory

It was 10-100x faster then network & disk, but it's harder to make fault tolerant...

To design a distributed memory abstraction which is both fault-tolerant and efficient, the most common ideas were:

- Interfaces based on fine-grained updates to mutable state
- Replicating data or logs across nodes for fault tolerance, which is costly for data-intensive apps, and 10-100x slower than a memory write

These weren't good enough for the purpose of Spark, so the answer was therefore RDDs...

## RDDs

The idea of RDDs was to <mark>store the data lineage instead of the data</mark>, and then <mark>recompute it based on the lineage</mark> if there was a fault

The lineage is the computation steps which had to be computed to obtain a specific dataset

RDDs are:

- <mark>Partitioned across nodes</mark> (sharded data structure)
- <mark>Immutable</mark>, to simplify lineage tracking (lineage always correct)
- Can only be built through <mark>coarse-grained deterministic transformations</mark> (map, filter, join...)
- <mark>Checkpointed to disk</mark>, to avoid unbounded lineage

This enables efficient in-memory processing, which is orders of magnitude faster than iterative algorithms

## RDD Recovery

If we <mark>lose the memory contents</mark>, we need to <mark>recompute the data we lost</mark>, which can be done by using the lineage

Checkpointing is useful so we don't need to recompute the whole lineage

Recover happens at the granularity of specific partitions of the RDD

## Generality of RDDs

RDDs can express <mark>many parallel programs</mark> which <mark>naturally apply the same operation to multiple items</mark>

They unify many current programming models

- Data flow models such as MapReduce, Dryad and SQL
- Specialised models for iterative apps, such as BSP, iterative MapReduce

They also support new apps which these models do not support

## Tradeoff Space

RDDs have a <mark>very high write throughput</mark>, near the memory bandwidth, however have a <mark>pretty coarse granularity of updates</mark>

This means they are best for <mark>batch workloads (OLAP)</mark>

Key-Value stores on the other hand, are better for transactional workloads

## Spark Programming Interface

Spark uses an API in the Scala language

It's usable interactively from the Scala interpreter

It provides:

- <mark>RDDs</mark>
- <mark>Operations on RDDs</mark>: <mark>transformations</mark> (building new RDDs) and <mark>actions</mark> (computing and outputting results)
- Control of each RDDs <mark>partitioning</mark> (layout across nodes) and <mark>persistence</mark> (storage in RAM/on disk)

## Example: Log Mining

An example is <mark>loading error messages from a log into memory</mark>, and then interactively searching for various patterns

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

RDDs <mark>track the graph of transactions which build them</mark> - their lineage - to <mark>rebuild lost data</mark>

For example, the RDD messages:

```
messages = textFile(...).filter(_.contains("error")).map(_.split('\t')(2))
```

Would generate a HadoopRDD, then a FilteredRDD, then a MappedRDD, which are all stored in the lineage

The results show that <mark>when a failure happens</mark>, it can be <mark>rectified in that iteration pretty quickly</mark> and <mark>not affect another interaction</mark>

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

Therefore, we can <mark>co-partition them, e.g. hash both on the URL, to avoid shuffles</mark>

We can also use app knowledge, so hash on the DNS name

This can be done by adding the line:

```
links = links.partitionBy(new URLPartitioner())
```

This therefore means that <mark>if a node fails</mark>, then <mark>only the partition which has that one partition of the has on needs to be rebuilt</mark>, as other partitions don't rely on it for their lineage

### Performance

The time per iteration of PageRank was:

- 171 seconds in Hadoop - needs to materialise results and write them to disk
- 72 seconds on Basic Spark
- 23 seconds on Spark with co-partitioning - faster as joins can be executed more efficiently
