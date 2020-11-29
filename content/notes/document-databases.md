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

# Schema Design

Mongo is basically schema free

# Indexes

# Aggregation
