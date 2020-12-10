---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Encrypted Databases
slug: encrypted-databases
topic: 7.1
hidden: false
tags:
  - Encrypted Databases
---

## Why do we need Encrypted Databases?

Organisations may not trust database service providers to protect the confidentiality of personal data or company data

A cloud database provider might breach their data processing agreement, by:

- Passing data to another party or government agency
- Deny access to the database in a dispute (e.g over pay)
- Use other providers for services (e.g. storage) without user permission
- Not have adequate security measures and get hacked
- Keep changing their terms and conditions

A privileged user (or hacker) who is malicious may be able to:

- Read or copy data from disk or RAM
- Modify or delete data
- Swap/delay/replay data
- Manipulate access controls
- Observe who accesses which data, when, and where from

One way to help would be to encrypt/decrypt the entire database client side, but then if you need a few rows, it's hard to compare on hashes

The obvious way is to:

- Fetch all encrypted primary keys and values of the field you need from the data
- Decrypt the field
- Find all matching tuples
- Fetch the remaining attributes for the matched tuples from the server using the hashed primary key
- Decrypt the fetched attributes

However, this is WAY too intensive if you have a big database, as you have to transfer and decrypt it each time you want to execute a query

Therefore, we may encrypt the data and the query

- We'd then have the DBMS perform an encrypted query on the encrypted data without decrypting either (i.e. FHE)
- This is not easy since DBMSs are very feature rich - they need to:
  - Handle numerous datatypes and operators
  - Support transactions, access control, schema updates etc
  - Keep memory, storage and time overheads low
  - Prevent leakage and traffic analysis, whilst insuring integrity and freshness

## CryptDB

This is the first database system to fo encrypted processing on encrypted data

We have a trusted client/proxy, and an untrusted server

We send our query to the trusted client, which then encrypts it and sends it to the server

The server has a standard RDBMS, which executes the query

The result is sent back to the client, which decrypts it and returns the result

So a query like:

```
select * from staff where salary >- 50000;
```

Would be rewritten as:

```
select * from table7 where col4 >= x738D3AB63;
```

Where the client would decrypt the returned results

It does not protect the number of rows, number of columns, or approximate size of data in a database

### Encryption Onions

CryptDB uses onions of encryption - a stack of different encryption schemes

The different encryption schemes are are RND, DET, JOIN, OPE, OPE-JOIN, SEARCH and HOM

These mean:

- Random (RND) - ensures that the same value used in different places in the database encrypts to different cyphertexts. It's encrypted using AES and Blowfish, and leads to unusable cyphertext
- Deterministic (DET) - this is used for EQUALS, Equi-Joins, GROUP BY, COUNT and DISTINCT. Different keys are used for DET to prevent cross-column correlation. It's based on AES
- Order Preserving Encryption (OPE) - this is used for ordering, ensuring that if $x<y$, then $OPE(x) < OPE(y)$. Also supports MIN, MAX, and ORDER BY
- Homomorphic Encryption (HOM) - this is used for addition, sum and average. It ensures $HOM_k(x) \times HOM_k(y) = HOM_k(x+y)$. It's implemented using Pallier cryptosystem
- Join (JOIN and OPE-JOIN). This is needed because different keys are used for DET to prevent cross-column correlation
- Word Search (SEARCH) - this supports keyword search - LIKE

Some example onions are:

- EQUALS: The plaintext value is first encrypted using JOIN, thn DET, then RND. Outer layers have strong encryption properties. DET and JOIN can be combined into a single encryption layer
- ORDER: The plaintext value is first encrypted using OPE-JOIN, then OPE, then RND
- SEARCH: Uses a single encryption scheme, SEARCH
- ADDITION: Uses a single encryption scheme, HOM

Administrators can mark attributes as sensitive, to use strong security, or best effort, for less strong security

It does not address integrity, freshness or completeness of results

Each column is mapped to one or more onions, depending on application requirements

For example, the following `Student` table:

| `ID` | `NAME` |
| ---- | ------ |
| 32   | Alice  |

Could be mapped to `table7`:

| `c1_equals` | `c1_order` | `c1_add` | `c2_equals` | `c2_order` | `c2_search` |
| ----------- | ---------- | -------- | ----------- | ---------- | ----------- |
| 84ab9a...   | e98a...    | 54f3...  | 2445c...    | abde8...   | 7acd...     |

Here, `ID` is mapped to:

1. An equals onion (`c1_equals`)
2. An order onion (`c1_order`)
3. An add onion (`c1_add`)

`NAME` is mapped to:

1. An equals onion (`c2_equals`)
2. An order onion (`c2_order`)
3. A SEARCH onion (`c2_SEARCH`)

Attribute values are now ciphertexts

Table names and column names are replaced by CryptDB by less obvious names, so here `student` $\rightarrow$ `table7` and `ID` $\rightarrow$ `c1`

Each onion is initally encrypted up to the outer encryption scheme

To perform an operation on an attribute, CryptDB will decrypt an onion down to the appropriate encryption scheme, like this:

```
update table7 set c2_equals = decrypt_RND(key, c2_equals)
```

Here, the SQL update query decrypts NAME's equals onion from the RND ciphertext down to the DET ciphertext as preparation to one or more DET_related SQL operations

`decrypt_RND` is a CryptDB function installed on the DB server, and `key` is derived from a master key for the table, column, onion and layer using AES

Here is another example:

```
update table7 set c2_equals = decrypt_RND(K_{t7,c2,Equals,RND}, c2_equals)

// then call

select c1_equals from table7 where ce_equals=d3ac...

// then if someone else wants to write a query, we don't need to decrypt again

select COUNT(*) from table7 where c2_equals=34bd...
```

In this example, the DQL server will first decrypt the `c2_equals` RND ciphertext to the DET cyphertext

Then it will do a search for the row where `c2_equals` equals `d3ac...`, where we assume the cyphertext `d3ac...` is the double encryption of 'Alice' with key $K_{t7,c2,Equals,JOIN}$ then with key $K_{t7,c2,Equals,DET}$

THE SQL SERVER WILL RETURN THE `c1_equals` ciphertext of the selected tow to the client

The client will then decrypt the return value using the keys $K_{t7,c2,Equals,RND}$, then $K_{t7,c2,Equals,DET}$, then $K_{t7,c2,Equals,JOIN}$

On completion of the encrypted search, the value of `c2_equals` is now only doubly encrypted

Instead of immediately re-encrypting or restoring back to RND, it attempts to intelligently keep attributes at frequently accessed encryption levels, and re-encrypting based on a policy, to help with performance

Operations like SUM and + are rewritten as server side function calls using HOM

Key management is a crucial part of CryptDB
