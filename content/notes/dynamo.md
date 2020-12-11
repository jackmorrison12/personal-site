---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Dynamo
slug: dynamo
topic: 9
hidden: false
tags:
  - Dynamo
  - Amazon
---

Dynamo is Amazon's Highley Available Key-Value Store

## Motivation

In modern data centres, there are hunderds of services running

These run on thousands of commodity machines, and serve millions of customers at peak times

In order to earn money, they need performance, reliability and efficiently

This means outages are bad, since customers lose confidence, and businesses lose money

However accidents, happen, and so Dynamo was built to tolerate these accidents

## Service Requirement in Data Centres

Availability: Service must be accessible at all times

Scalability: Service must scale well to handle customer and machine growth

Failure Tolerance: With thousands of machines, failure is inevitable, individual failures should be handled

Manageability: It must have a low admin cost to maintain

## Dynamo's Design Assumptions

Query Model

- Simple read/write operations with unique IDs
- No operations span multiple records 9one key at a time, for performance)
- Data is stores as binary objects of small size

ACID Properties

- Weaker (eventual) consistency
  - Eventually, every node will be consistent

Efficiency

- Optimise for the 99.9th percentile

## Dynamo's API

Dynamo's API only had 2 operations:

```
put(key, context, object)

get(key)
```

Where:

- `key`: Primary key associated with the data object
- `context`: Vector clocks and history (needed for merging)
- `object`: Data to store

## CAP Theorem

### Eventual Consistency

## Service Level Agreements (SLAs)

## Design Considerations

## Techniques Used

## Consistency & Availability

## Data Partitioning & Replication

### DHT

### Data Replication

### Data Versioning

## Execution of `get()` and `put()`

## Storage Nodes

## Handling Failures

### Merkle Trees

### Membership & Failure Detection

## Evaluation

### Request latency

### Buffered Writes

### Load Balancing

## Comparison to [Bigtable](/notes/scalable-systems/bigtable)
