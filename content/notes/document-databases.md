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
  - JSON
  - Indexes
  - Aggregation
---

# Introduction to Document Databases

## Motivations

Document databases were created as an <mark>alternative to SQL</mark>, which has problems such as:

- <mark>Rigid schema</mark>
- <mark>Not easily scalable</mark> (for distributed machines)
- Requires <mark>unintuitive joins</mark>

Document databases, namely <mark>MongoDB</mark>, offered the perks of:

- An <mark>easy interface</mark> with common languages (like Java/JS/PHP)
- Tech which could <mark>run anywhere</mark> (VMs, cloud etc.)
- Keeping the essential features of RDBMSs, while <mark>learning from key-value</mark> noSQL systems

## Data Model

They're <mark>document based</mark>, where a document has a max size of 16MB

Documents are in a BSON format, consisting of <mark>key-value pairs</mark>

Each document is stored in a <mark>collection</mark>

Collections:

- Have an <mark>index set</mark> in common
- Are <mark>like tables in a relational database</mark>
- <mark>Do not need to have a uniform structure</mark>

### JSON

They use JSON (JavaScript Object Notation), which is <mark>easy for humans to read/write</mark> and for <mark>computers to parse/generate</mark>

JSON objects can be <mark>nested</mark>

JSON is built on <mark>name/value pairs</mark>, and an <mark>ordered list of values</mark>

### BSON

Under the hood, the use BSON, which is essentially <mark>Binary JSON</mark>(a binary-encoded serialisation of JSON-like docs)

BSON allows for <mark>referencing</mark>

BSON's embedded structure <mark>reduces the need for joins</mark>

BSOn has the goals of being <mark>lightweight, traversable and efficient</mark> (at encoding and decoding)

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

It also has an <mark>\_id field by default</mark>, which has some special characteristics:

- Value serves as the <mark>primary key</mark> for the collection
- Value is <mark>unique, immutable</mark> and may be any <mark>non-array type</mark>
- Default data type is <mark>ObjectId</mark>, which is "<mark>small, likely unique, fast to generate and ordered</mark>", so sorting on it is similar to sorting on creation time

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

MongoDB follows a <mark>very logical set of CRUD instructions</mark>, which can be found [in their CRUD documentation](https://docs.mongodb.com/manual/crud/)

# Schema Design

MongoDB is basically <mark>schema free</mark>

It has a 'flexible' schema, where <mark>certain records can have different fields</mark>, which can add more <mark>complexity of checking which fields you have</mark> to the application code

This means there are <mark>two methods of joining</mark>:

## Embedding

This is when we have a <mark>one-to-one relationship</mark>

We <mark>embed a document inside of another one</mark>, so they just make one overall document

It can be used for one-to-many relationships, but the embedded data is now duplicated in every document which has it embedded, which is wasting space...

## Linking

This is used when we have a <mark>one-to-many relationship</mark>

This is where we <mark>put the id of one document in the other</mark>, so they can be linked together

It's like a <mark>foreign key in SQL</mark>

We <mark>join these in the application code</mark>

## Embedding vs Linking

Embedding is like <mark>pre-joining data</mark>

However, embedding means if you only want one of the documents, you're still also <mark>retrieving the embedded one every time</mark>

Document level operations are easy for the server to handle

It's better to <mark>embed when the "many" objects always appear with their parents</mark>

Linking is used when you <mark>don't always need the "many" data</mark>, meaning you are more flexible

# Indexes

Without indexes, MongoDB must scan every document, which can get inefficient because large volumes of data are being processed

Indexes are <mark>special data structures</mark> that <mark>store a small portion of the collection's data set</mark> in an <mark>easy to traverse form</mark>

Using the example of a collection `users`:

- Indexes can be created using: `db.users.ensureIndex({score: 1})`
- Indexes can be shown using: `db.users.getIndexes()`
- Indexes can be dropped using: `db.users.dropIndex({score: 1})`
- To get a document which describes the process and if/which indexes are used: `db.users.find().explain()`
- To override the default index selection: `db.users.find().hint({score: 1})`

In MongoDB, there are <mark>three types of index</mark>:

- <mark>Single Field</mark> Indexes: `db.users.ensureIndex({score: 1})`
- <mark>Compound Field</mark> Indexes: `db.users.ensureIndex({userid:1, score: 1})`
- <mark>Multikey</mark> Indexes: `db.users.ensureIndex({addr.zip: 1})`

# Aggregation

Aggregation operations <mark>process data records and return computed results</mark>

They <mark>simplify application code</mark> and limit resource requirements

They're modelled on the concept of <mark>data processing pipelines</mark>

They provide:

- <mark>Filters</mark> - these operate like queries
- <mark>Document transformations</mark> - these modify the form of the output document
- Tool for <mark>grouping and sorting</mark>
- Tools for <mark>aggregating the content of arrays</mark>

They can also be used to do things such as calculating the average or concatenating a string

Some example <mark>pipeline stages</mark> are:

- `$limit`
- `$skip`
- `$sort`
- `$match`
- `$group`
- `$distinct`
