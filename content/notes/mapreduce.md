---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: MapReduce
slug: mapreduce
topic: 11
hidden: false
tags:
  - MapReduce
  - Google
  - Hadoop
---

MapReduce allows <mark>simplified data processing on large clusters of machines</mark>

## What is MapReduce

Before MapReduce, when handling large amounts of data, it was hard for all algorithms to get results in a reasonable amount of time

MapReduce is a mainstream <mark>"Big Data" analytics framework</mark>

- It was built to run algorithms like PageRank
- It was created by Google in 2004
- There is an open-source version called Hadoop, crated by Yahoo and Apache

The main benefits are:

- A <mark>simple programming model</mark>, with semantics easy to explain to developers
- It has <mark>transparent parallelisation</mark>
- It has <mark>fault-tolerant processing</mark>

## How it works

1. <mark>Data is partitioned</mark> over a <mark>distributed file system</mark>, in the form of <mark>key:value pairs</mark>
2. A <mark>`map` function</mark> is applied to this data on each machine
3. <mark>Intermediate key:value pairs</mark> are created
4. A <mark>shuffle operation happens</mark> to <mark>transmit keys</mark> which are the same so they're in the <mark>same reduce partition</mark>, which is done by <mark>sorting on the key</mark>
5. These are then <mark>reduced using the `reduce` function</mark>, by aggregating by keys of the same value

The two processing functions are:

- `map(k1,v1) --> list(k2, v2)`
- `reduce(k2, list(v2)) --> list(v3)`

## Example: Word Count

Consider a word count job for counting unique words

- <mark>Map</mark>: Processes the input data and generates (key:value) pairs
  - e.g. {(cat, 5), (dog, 7), (elephant, 9)}
- <mark>Shuffle</mark>: Distributes intermediate pairs to reduce tasks
  - e.g. all words starting with 'A' to reducer to, 'B' to 2 etc.
- <mark>Reduce</mark>: Aggregates all values associated to each key
  - e.g. sum all values for word "cat", all values for "dog"

## Execution Model

Map/reduce tasks are <mark>scheduled across cluster nodes</mark> by a <mark>locality-aware scheduler</mark>

<mark>Intermediate results are persisted to local disks</mark>, and the <mark>final results of MapReduce jobs are stored in GFS</mark>

The shuffle phase is all-to-all communication

## Failure Recovery

### Task Failure

If a <mark>task fails, then then it's restarted</mark>

- <mark>Map</mark> tasks would fetch data from the <mark>GFS</mark>
- <mark>Reduce</mark> tasks would fetch intermediate results from <mark>local disks</mark>

### Node Failure

Tasks running on that node are restarted on a new node

- <mark>All tasks need to be re-run</mark> since <mark>intermediate results are lost</mark>
- This is because <mark>intermediate results are stored on local disk</mark>, which is unavailable on node failure

## Speculative Execution

MapReduce jobs are <mark>dominated by the slowest task</mark>

Therefore, speculative execution is where <mark>MapReduce attempts to locate slow tasks</mark> (stragglers) and run <mark>redundant (speculative) tasks</mark>

This in the hope that the <mark>speculative tasks will finish before the stragglers</mark>

Only <mark>one copy of the straggler</mark> is allowed to be speculated

### Location Stragglers

Stragglers are located in Hadoop as Hadoop monitors each tasks progress using a score between 0 and 1

If a task's progress score is <mark>less than (average - 0.2)</mark> and the task has <mark>run for ar least a minute</mark>, it's marked as a <mark>straggler</mark>

## Iteration

Iteration is useful for many algorithms, such as <mark>machine learning and data mining</mark>

It is implemented using <mark>loop unrolling</mark> - which is <mark>running multiple MapReduce jobs</mark> - each iteration of the loop is a <mark>separate MapReduce job</mark>

The challenge is that the <mark>materialisation of intermediate results becomes expensive</mark>, since it's being <mark>written to GFS and read back</mark>
