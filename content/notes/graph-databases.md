---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Graph Databases
slug: graph-databases
topic: 3
hidden: false
tags:
  - Graph Databases
  - Neo4j
  - Cypher
---

# Introduction

## What are Graph Databases?

Graph databases consist of <mark>nodes and relationships</mark> - they're used to model graph data structures

Some examples are Neo4j, OrientDB, InfiniteGraph and AllegroGraph

## What are the pros and cons?

Pros:

- <mark>Powerful data model</mark>, as general as DBMS
- Connected data is locally indexed
- <mark>Easy to query</mark>
- <mark>Scale up</mark> reasonably well
- They work very well in <mark>main memory</mark>

Cons:

- Sharding
- Scaling out to <mark>multiple machines is hard</mark>

## What are they good for?

- <mark>Recommendations</mark>
- Business intelligence
- <mark>Social computing</mark> (e.g. friends of friends)
- Geospatial data
- Systems management
- Web of things
- Genealogy (tree structure)
- Time series data
- Product catalogue
- <mark>Web analytics</mark>
- Scientific computing (especially bioinformatics)

## What is a graph?

A graph is an abstract representation of a <mark>set of objects</mark> (also known as vertices and nodes), where <mark>some pairs are connected by links</mark> (also known as edges, arcs or relationships)

There are many types of graph, including:

- Undirected Graph (no indication of direction)
- Directed Graph (has directions on the links)

* Pseudo Graph (points to itself)
* Multi Graph (multiple relationships between nodes)

- Hyper Graph (multiple outgoing links from an object)

* Weighted Graph (links have a numerical value)
* Labelled Graph (links and objects have labels)
* Property Graph (links and objects have key-value pairs, e.g. Neo4j)

## Graphs in Relational Databases

We can represent a graph in a relational database using <mark>many-to-many relationships</mark>

E.g. to link a person node to a department node, both in their corresponding tables, we could make a Dept_Members table, which manages the relations, and this consists of the links from the graph

To get a connection, we need to <mark>join the tables together</mark>

In a graph database, we don't need these to be in tables, adn so we don't need to do the join

## Modelling Graph Databases

<mark>Generate the initial graph</mark> - we then have the nodes and relationships

We can also <mark>add properties to these nodes and relationships</mark> in the form of key:value pairs

# Neo4j

## What is it?

It's a <mark>graph database</mark>, which is a database with an explicit graph structure

<mark>Each node knows its adjacent nodes</mark>, and (ideally) each node is on the same machine as its neighbours

As the number of nodes increases, the cost of a local step remains the same

There is an index for lookups

They use <mark>main memory</mark>, so have very efficient lookups on the same machine

## Translating Relational Database to Neo4j

Each entity table is represented by a label on nodes

Each row in an entity table is a node

Columns on those tables become properties

Add unique constraints for business primary keys, add indexes for frequent lookup attributes

## Properties of Nodes and Relationships

Both <mark>nodes and relationships can have properties</mark>

These are <mark>key:value pairs</mark>, where they key is a unique string

Property values can be either a <mark>primitive or an array of one primitive type</mark>

## Paths

A path is <mark>one more nodes with connecting relationships</mark>, typically retrieved as a query or traversal result

They can be useful for queries like:

- "Is there a path between these two nodes?"
- "Which node is this particular node connected to?"

These are really inefficient to calculate in a relational database

# Cypher

Cypher is a language used to write queries for Neo4j

It is a <mark>declarative pattern-matching language</mark>

It has <mark>SQL-like syntax</mark>

It is designed for graphs

## Examples of Cypher

### 2 nodes, 1 relationship

This will retrieve all pairs of nodes $a$,$b$, connected with a relationship:

```
START a=node(*)
MATCH (a)-->(b)
RETURN a,b;
```

This will retrieve the names of all nodes with an outgoing relationship:

```
START a=node(*)
MATCH (a)-->()
RETURN a.name;
```

This will get all actors, $a$, which have acted in a movie:

```
START a=node(*)
MATCH (a)-[:ACTED_IN]->(m)
RETURN a;
```

### Paths

A node $a$, which is connected to a node $b$, which is connected to a node $c$ can be represented as:

```
(a)-->(b)-->(c)
```

You can also have the relationships the other way, so will return all nodes which have 2 incoming nodes:

```
(a)-->(b)<--(c)
```

So an example is to get all triples where an actor has acted in a movie, and the director which directed it:

```
START a=node(*)
MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d)
RETURN a.name, m.title, d.name;
```

This could be re-written by breaking it up and changing the direction of the arrows, as:

```
START a=node(*)
MATCH (a)-[:ACTED_IN]->(m),
(d)-[:DIRECTED]->(m)
RETURN a.name, m.title, d.name;
```

### Sort & Limit

You can also sort and limit queries, as in SQL:

```
START a=node(*)
MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d)
RETURN a.name, d.name, count(*) AS count
ORDER BY (count) DESC
LIMIT 5;
```

### Aggregation

This again is very similar to SQL, with the commands:

```
count(x)   // Add up the number of occurrences
min(x)     // Get the lowest value
max(x)     // Get the highest value
avg(x)     // Get the average of a numeric value
collect(x) // Collect all of the occurrences into an array
           // (transposes a column to an array)
```

An example of collect is where you'd have an array of all titles a pair of actor and director had worked on together:

```
START a=node(*)
MATCH (a)-[:ACTED_IN]->(m)<-[:DIRECTED]-(d)
RETURN a.name, d.name, collect(m.title);
```

### Finding a Specific Node

You need to make sure a node has the appropriate properties before you can query them:

```
START a=node(*)
WHERE has(n.name) AND n.name = "Tom Hanks" // Check the property exists & filter the results with the correct value
RETURN n;
```

### Matching Multiple Relations & Creating Relationships

You can match on multiple different relationships, and also create new relationships:

```
START a=node(*)
MATCH (a)-[:ACTED_IN|DIRECTED]->()<-[:ACTED_IN|DIRECTED]-(b)
CREATE UNIQUE (a)-[:KNOWS]->(b);
```

### Variable Length Paths

A variable length path query can be really powerful, and is hard to do on relational databases

This query is saying two nodes, $a$ and $b$, are connected by 1-3 relationships:

```
(a)-[*1..3]->(b)
```

This can also lead to friends of friends relationships:

```
MATCH (keanu)-[:KNOWS*2]->(fof)
WHERE keanu.name = "Keanu Reeves"
RETURN DISTINCT fof.name;
```

### Constraints on Properties

Movies in which Keanu Reeves played Neo:

```
MATCH (actor)-[r:ACTED_IN]->(movie)
WHERE "Neo" in r.roles AND actor.name = "Keanu Reeves"
RETURN DISTINCT movie.title;
```

### Constraints on Patterns

Actors who acted in a movie with Gene Hackman:

```
MATCH (gene)-[ACTED_IN]->(movie)<-[:ACTED_IN]-(n)
WHERE gene.name = "Gene Hackman"
RETURN DISTINCT n.name;
```

Actors who acted in a movie with Gene and were also directors of at least one film:

```
MATCH (gene)-[ACTED_IN]->(movie)<-[:ACTED_IN]-(n)
WHERE gene.name = "Gene Hackman" AND (n)-[:DIRECTED]->()
RETURN DISTINCT n.name;
```

### Creating Nodes

```
CREATE ({title: "Mystic River", released: 1993});
```

### Adding Properties

```
MATCH(a)
WHERE a.title = "Mystic River"
SET a.tagline = "We bury our sins here, Dave. We wash them clean."
RETURN a;
```

### Creating Relationships

```
CREATE UNIQUE (kevin)-[:ACTED_IN {roles:["Sean"]}]->(movie)
WHERE movie.title = "Mystic River" AND kevin.name = "Kevin Bacon";
```

### Deleting Relationships

```
MATCH (emil)-[r]->()
WHERE emil.name = "Emil Eifrem"
DELETE r;
```

### Deleting Nodes and Relationships

```
MATCH (emil)-[r]->()
WHERE emil.name = "Emil Eifrem"
DELETE r, emil;
```

If it doesn't matter if it exists, but you want to remove it if it does:

```
MATCH (emil)-[r?]->()
WHERE emil.name = "Emil Eifrem"
DELETE r, emil;
```
