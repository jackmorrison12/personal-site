---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Document Databases
slug: document-databases
topic: 4.2
hidden: false
tags:
  - Document Databases
  - MongoDB
---

# Introduction to Document Databases

## Motivations

Document databases were created as an alternative to SQL, which has problems such as:

- Rigid schema
- Not easily scalable (for distributed machines)
- Requires unintuitive joins

Document databases, namely MongoDB, offered the perks of:

- An easy interface with common languages (like Java/JS/PHP)
- Tech which could run anywhere (VMs, cloud etc.)
- Keeping the essential features of RDBMSs, while learning from key-value noSQL systems

## Data Model

They're document based, where a document has a max size of 16MB

Documents are in a BSON format, consisting of field-value pairs

Each document is stored in a collection

Collections:

- Have an index set in common
- Are like tables in a relational database
- Do not need to have a uniform structure

### JSON

They use JSON (JavaScript Object Notation), which is easy for humans to read/write and for computers to parse/generate

JSON objects can be nested

JSON is built on name/value pairs, and an ordered list of values

### BSON

Under the hood, the use BSON, which is essentially Binary JSON ( a binary-encoded serialisation of JSON-like docs)

BSON allows for referencing

BSON's embedded structure reduces the need for joins

BSOn has the goals of being lightweight, traversable and efficient (at encoding and decoding)

An example of some BSON is:

```
{
  "_id":   "37010",
  "city":  "ADAMS",
  "pop":   2660,
  "state": "TN",
  "councilman": {
    "name":    "John Smith",
    "address": "13 Scenic Way"
  }
}
```

BSON has [many types](https://docs.mongodb.org/manual/reference/bson-types/) which can be used

It also has an \_id field by default, which has some special characteristics:

- Value serves as the primary key for the collection
- Value is unique, immutable and may be any non-array type
- Default data type is ObjectId, which is "small, likely unique, fast to generate and ordered", so sorting on it is similar to sorting on creation time

### MongoDB vs SQL

| MongoDB                                   | SQL                       |
| ----------------------------------------- | ------------------------- |
| Document                                  | Tuple                     |
| Collection                                | Table/View                |
| PK: \_id Field                            | PK: Any Attribute(s)      |
| Uniformity not required                   | Uniform Relational Schema |
| Index                                     | Index                     |
| Embedded Structure (pre-joined documents) | Joins (explicit)          |

# CRUD

MongoDB follows a very logical set of CRUD instructions, which can be found [in their CRUD documentation](https://docs.mongodb.com/manual/crud/)

# Schema Design

Mongo is basically schema free

We have a 'flexible' schema, where certain records can have different fields, which can add more complexit of checking which fields you have to the application code

This means there are two methods of joining:

## Embedding

This is when we have a one-to-one relationship

We embed a document inside of another one, so they just make one overall document

It can be used for one-to-many relationships, but the embedded data is now duplicated in every document which has it embedded, which is wasting space...

## Linking

This is used when we have a one-to-many relationship

This is where we put the id of one document in the other, so they can be linked together

It's like a foreign key in SQL

We join these in the application code

## Embedding vs Linking

Embedding is like pre-joining data

However, embedding means if you only want one of the documents, you're still also retrieving the embedded one every time

Document level operations are easy for the server to handle

It's better to embed when the "many" objects always appear with their parents

Linking is used when you don't always need the "many" data, meaning you are more flexible

# Indexes

Before we add indexes, MongoDB must scan every document, which can get inefficient because large volumes of data are being processed

Indexes are special data structures that store a small portion of the collection's data set in an easy to traverse form

Using the example of a collection `users`:

- Indexes can be created using: `db.users.ensureIndex({score: 1})`
- Indexes can be shown using: `db.users.getIndexes()`
- Indexes can be dropped using: `db.users.dropIndex({score: 1})`
- To get a document which describes the process and if/which indexes are used: `db.users.find().explain()`
- To override the default index selection: `db.users.find().hint({score: 1})`

In MongoDB, there are three types of index:

- Single Field Indexes: `db.users.ensureIndex({score: 1})`
- Compound Field Indexes: `db.users.ensureIndex({userid:1, score: 1})`
- Multikey Indexes: `db.users.ensureIndex({addr.zip: 1})`

# Aggregation

Aggregation operations process data records and return computed results

They simplify application code and limit resource requirements

They're modelled on the concept of data processing pipelines

They provide:

- Filters - these operate like queries
- Document transformations - these modify the form of the output document
- Tool for grouping and sorting
- Tools for aggregating the content of arrays

They can also be used to do things such as calculating the average or concatenating a string

Some example pipeline stages are:

- `$limit`
- `$skip`
- `$sort`
- `$match`
- `$group`
- `$distinct`
