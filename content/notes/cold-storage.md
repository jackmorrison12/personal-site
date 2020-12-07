---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Cold Storage
slug: cold-storage
topic: 6.1
hidden: false
tags:
  - Cold Storage
---

# Introduction

We don't access ll data with the same frequency

Any data which we access infrequently is called cold data

This is usually very large in size - there is much more daa we don't access often than data we do access often

We usually store it on slower disks or tape

The objective is high performance at low cost

Cold data may be things we need to store for regulatory purposes

WE have to look at price vs latency:

- The 'hot tier' of data:
  - Is expensive to store, since it has a very active access pattern
  - Is provisioned for peak
  - Is high throughput
  - Is low latency
- The 'cold tier' of data, which consists of cold data and archival data:
  - Is low cost, since it is written once and read basically never
  - Has a high latency
  - High density
  - Low hardware cost
  - Low operating cost
  - Latency needs to be lower than tape

We need to provision just enough resources for the cold data workload:

- Disks (archival and SMR)
- Power
- Cooling
- Bandwidth

However, only just enough for the required workload

- We don't want to keep all disks spinning
- We don't need peak performance
- We need enough disks to be able to spin up to fill the bandwidth

The advantages of removing unnecessary resources are:

- High density of storage
- Low hardware cost (e.g. only a subset of cooling needed)
- Low operating cost (capped performance / cap on energy used at a time)

Therefore, we limit the power and cooling facilities, so only one disk group is spun up at once, and the disk switch latency is around 10-30 seconds

The workload is WORO (Write once, read occasionally)

# Pelican

This was a cold storage solution created by Microsoft

The mechanical, hardware and storage software stack is co-designed

It's right-provisioned for cold data workload

Only 8% of the disks are spinning at once - the rest are in a standby state - powered but not spinning

It's designed to store blobs (binary large objects) which are infrequently accessed

## Resource Domain

Each domain is only provisioned to supply its resource to a subset of disks

Each disk uses resources from a set of resource domains

Domain-conflicting - Disks that are in the same resource domain

Domain-disjoint - Disks that share no common resource domains

The three domains are:

- Cooling
- Power
- Bandwidth

## Data Layout & Placement

The objective is to maximise the number of requests that can be concurrently services while operating within constraints

Each blob is stored over a set of disks

It's split into a sequence of 128kB fragments, and for each $k$ fragments, additional $r$ fragments are generated (for error corrections)

The $k+r$ fractions form a stripe

They statically partition disks into groups and disks within a group can be concurrently active

Concentrate all conflicts over a few sets of disks

Each disk in a group is in a different power and cooling domain

## IO Scheduler

Traditional disks are optimised to reorder IOs to minimise seek latency

Pelican reorders requests in order to minimise the impact of spin up latency

There are four independent schedulers - each services requests for its class and reordering happens at class lebel

Each scheduler uses 2 queues - one for reorder operations and one for other operations

Reordering (like defragmentation) is done to amortise the group spin up latency over the set of operations

Rate limiting is done to manage the interface between reorder and other operations

## Implementation Considerations

Power up in Standby is used to ensure disks don't sin without the Pelican storage stack managing the constraints

The start up device usually draws more power at the beginning as it is spinning

When in standby, disks spin at a very low speed - least required energy

Group abstraction is exploited to parallelise the boot process

- Initialisation is done on the group level
- If there are no user requests, then all 4 groups are concurrently initialised
- It takes around 3 mins to initialise the entire rack

## Evaluation

We can compare Pelican against a system organised like Pelican but with full provisioning (FP) for power and cooling

This means it uses the same internal topology, but disks are never spun down

### Performance - Rack Throughput

Throughput increases with workload rate, but reaches a limit earlier for Pelican than FP, since there are disk group switches

### Time to First Byte

With small workload rates, the time to first byte is much better for FP, since it doesn't need to wait to spin up, however at a higher workload rate, they tend towards the same value

Pelican takes ~14.2 seconds to activate a group, and so this is the smallest amount of time it can take to get the first byte

### Power Consumption

The power consumption for FP is constantly at 10.8kW, since all disks are spinning, whereas for Pelican, it's peak is 3.7kW, and when all disks are in standby it's 1.8kW

On average pelican takes around 2-3kW of power

### Pros vs Cons

Pros:

- Reduced cost
- Reduced power consumption
- Erasure codes for fault tolerance
- Hardware abstraction simplifies IO schedulers work

Cons:

- Tight constraints - less flexible to changes
- Sensitive to hardware changes
- No justification to some of the configuration decisions made
- Not sure it's an optimal design - it's designed for a very specific case (archival data)

# Data Processing

Cold storage devices are WORO (write-once-read-occasionally), and so at some points, we need to process data on them

## Query Execution over CSD

Traditionally, we have things like:

- Uniform Access
- Control Layout
  0- Static Execution

However, now we don't have these - instead we have pull-based execution, which will trigger unwarranted group switches

If we have many things accessing cold storage, we need to find new ways to manage this

For an enterprise datacentre, as the number of clients increases, so does the average execution time for CSD (a LOT more than compared to HDD)

As we increase group switch latency, the execution time increases too (whereas it stays constant for HDD as it doesn't have group switching)

Therefore, we need a hardware-software co-design:

1. Data access has to be hardware-driven to minimise group switches
2. Query execution engine has to process data pushed from storage in out-of-order (unpredictable) manner
3. Reduce data round-trips to cold storage by smart data caching

## Batch Processing on CSD

When we process data infrequently, we need to know how to do it

Some common batch processes on cold data are:

- Massive-Scale Group-By / Join
- (Near)-Duplicate Detection
- Data Localisation
- In-place Map-Reduce

Therefore, we have data partitioning:

- Scan the data
- Partition the items into K groups
  - Distribute these between K disk groups
  - `group_ID = Partitioner(element`
  - We can have various partitioners, e.g. hash, range, map
- Fill up the buffer until full
- Flush the data back to CSD

## Flushing

When the buffer is full, we need to decide which disk group to flush it back to

### Buff-Pack

This is the greedy approach

We want to empty the buffer into the currently active disk group to avoid switching, if possible

Otherwise, we switch to the disk group with the largest buffer

In this case, we only flush the part of the buffer which corresponds to the currently active disk group

### Off-Pack

We flush the entire buffer into the active disk group

We do write-offloading, which is where we write data into the wrong disk group, and then transfer it later

When the buffer is dull, and we're in active partition i:

- Flush `buffer[i]` into the active disk group
- For all `j != i` flush `buffer[j]` into `offload_buffer_i_j`
- In post-processing, we move all of `offload_buffer_i_j` into disk group `j`

We do the post-processing every so often

### Buff-Pack vs Off-Pack

Off-Pack has fewer switches, but more read/write

Off-Pack is better for:

- Smaller buffer
- Higher number of disk groups
- Higher throughput

So, off-pack is better for most cases, except if there is a very small number of disk groups, the disk switch latency is very small, or the buffer is very large
