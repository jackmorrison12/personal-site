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

MapReduce allows simplified data processing on large clusters of machines

## What is MapReduce

Before MapReduce, when handling large amounts of data, it was hard for all algorithms to get results in a reasonable amount of time

MapReduce is a mainstream "Big Data" analytics framework

- It was built to run algorithms like PageRank
- It was created by Google in 2004
- There is an open-source version called Hadoop, crated by Yahoo and Apache

The main benefits are:

- A simple programming model, with semantics easy to explain to developers
- It has transparent parallelisation
- It has fault-tolerant processing

## How it works

1. Data is partitioned over a distributed file system, int he form of key:value pairs
2. A `map` function is applied to this data on each machine
3. Intermediate key:value pairs are created
4. A shuffle operatios happens to transmit keys which are the same so they're in the same reduce partition, which is done by sorting on the key
5. These are then reduced using the `reduce` function, by aggregating by keys of the same value

The two processing functions are:

- `map(k1,v1) --> list(k2, v2)`
- `reduce(k2, list(v2)) --> list(v3)`

## Example: Word Count

Consider a word count job for counting unique words

- Map: Processes the input data and generates (key:value) pairs
  - e.g. {(cat, 5), (dog, 7), (elephant, 9)}
- Shuffle: Distributes intermediate pairs to reduce tasks
  - e.g. all words starting with 'A' to reducer to, 'B' to 2 etc.
- Reduce: Aggregates all values associated to each key
  - e.g. sum all values for word "cat", all values for "dog"

## Execution Model

Map/reduce tasks are scheduled across cluster nodes by a locality-aware scheduler

Intermediate results are persisted to local disks, and the final results of MapReduce jobs are stores in GFS

The shuffle phase is all-to-all communication

## Failure Recovery

### Task Failure

If a task fails, then then it's restarted

- Map tasks would fetch data from the GFS
- Reduce tasks would

### Node Failure

Tasks running on that node are restarted on a new node

- All tasks need to be re-run since intermediate results are lost
- This is because intermediate results are stored on local disk, which is unavailable on node failure

## Speculative Execution

MapReduce jobs are dominated by the slowest task

Therefore, speculative execution is where MapReduce attempts to locate slow tasks (stragglers) and run redundant (speculative) tasks

This in the ope that the speculative tasks will finish before the stragglers

One only copy of the straggler is allowed to be speculated

### Location Stragglers

Stragglers are located in Hadoop as Hadoop monitors each tasks progress using a score between 0 and 1

If a task's progress score is less than (average - 0.2) and the task has run for ar least a minute, it's marked as a straggler

## Iteration

Iteration is useful for many algorithms, such as machine learning and data mining

It is implemented using loop unrolling - which is running multiple MapReduce jobs - each iteration of hte loop is a separate MapReduce job

The challenge is that the materialisation of intermediate results becomes expensive, since it's being written to GFS and read back
