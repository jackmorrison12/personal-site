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

Organisations may <mark>not trust database service providers</mark> to protect the confidentiality of personal data or company data

A cloud database provider might <mark>breach their data processing agreement</mark>, by:

- Passing data to <mark>another party or government agency</mark>
- <mark>Deny access</mark> to the database in a dispute (e.g over pay)
- Use <mark>other providers</mark> for services (e.g. storage) without user permission
- Not have <mark>adequate security</mark> measures and get hacked
- Keep changing their <mark>terms and conditions</mark>

A <mark>privileged user</mark> (or hacker) who is malicious may be able to:

- <mark>Read or copy data</mark> from disk or RAM
- <mark>Modify or delete</mark> data
- Swap/delay/replay data
- Manipulate <mark>access controls</mark>
- <mark>Observe</mark> who accesses which data, when, and where from

One way to help would be to <mark>encrypt/decrypt the entire database client side</mark>, but then if you need a few rows, it's hard to compare on hashes

The obvious way is to:

- <mark>Fetch all</mark> encrypted primary keys and values of the field you need from the data
- <mark>Decrypt</mark> the field
- Find all <mark>matching tuples</mark>
- <mark>Fetch the remaining attributes</mark> for the matched tuples from the server using the hashed primary key
- <mark>Decrypt</mark> the fetched attributes

However, this is <mark>WAY too intensive</mark> if you have a big database, as you have to transfer and decrypt it each time you want to execute a query

Therefore, we may <mark>encrypt the data and the query</mark>

- We'd then have the DBMS perform an <mark>encrypted query on the encrypted data</mark> without decrypting either (i.e. FHE)
- This is not easy since DBMSs are very feature rich - they need to:
  - Handle <mark>numerous datatypes and operators</mark>
  - Support <mark>transactions, access control, schema updates</mark> etc
  - Keep <mark>memory, storage and time overheads</mark> low
  - Prevent <mark>leakage and traffic analysis</mark>, whilst insuring integrity and freshness

## CryptDB

This is the first database system to fo encrypted processing on encrypted data

We have a <mark>trusted client</mark>/proxy, and an <mark>untrusted server</mark>

We <mark>send our query to the trusted client</mark>, which then <mark>encrypts it and sends it to the server</mark>

The server has a standard RDBMS, which executes the query

The <mark>result is sent back to the client</mark>, which decrypts it and returns the result

So a query like:

```
select * from staff where salary >- 50000;
```

Would be rewritten as:

```
select * from table7 where col4 >= x738D3AB63;
```

Where the client would decrypt the returned results

It <mark>does not protect the number of rows</mark>, <mark>number of columns</mark>, or <mark>approximate size of data</mark> in a database

### Encryption Onions

CryptDB uses <mark>onions of encryption</mark> - a stack of different encryption schemes

The different encryption schemes are are RND, DET, JOIN, OPE, OPE-JOIN, SEARCH and HOM

These mean:

- <mark>Random</mark> (RND) - ensures that the same value used in different places in the database encrypts to different cyphertexts. It's encrypted using AES and Blowfish, and leads to unusable cyphertext
- <mark>Deterministic</mark> (DET) - this is used for EQUALS, Equi-Joins, GROUP BY, COUNT and DISTINCT. Different keys are used for DET to prevent cross-column correlation. It's based on AES
- <mark>Order Preserving Encryption</mark> (OPE) - this is used for ordering, ensuring that if $x<y$, then $OPE(x) < OPE(y)$. Also supports MIN, MAX, and ORDER BY
- <mark>Homomorphic Encryption</mark> (HOM) - this is used for addition, sum and average. It ensures $HOM_k(x) \times HOM_k(y) = HOM_k(x+y)$. It's implemented using Pallier cryptosystem
- <mark>Join</mark> (JOIN and OPE-JOIN). This is needed because different keys are used for DET to prevent cross-column correlation
- <mark>Word Search</mark> (SEARCH) - this supports keyword search - LIKE

Some example onions are:

- <mark>EQUALS</mark>: The plaintext value is first encrypted using JOIN, thn DET, then RND. Outer layers have strong encryption properties. DET and JOIN can be combined into a single encryption layer
- <mark>ORDER</mark>: The plaintext value is first encrypted using OPE-JOIN, then OPE, then RND
- <mark>SEARCH</mark>: Uses a single encryption scheme, SEARCH
- <mark>ADDITION</mark>: Uses a single encryption scheme, HOM

Administrators can <mark>mark attributes as sensitive</mark>, to use strong security, or best effort, for less strong security

It does not address integrity, freshness or completeness of results

<mark>Each column</mark> is mapped to <mark>one or more onions</mark>, depending on application requirements

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

<mark>Attribute values</mark> are now <mark>ciphertexts</mark>

<mark>Table names and column names</mark> are replaced by CryptDB by <mark>less obvious names</mark>, so here `student` $\rightarrow$ `table7` and `ID` $\rightarrow$ `c1`

Each onion is <mark>initially encrypted up to the outer encryption scheme</mark>

To perform an operation on an attribute, CryptDB will <mark>decrypt an onion</mark> down to the <mark>appropriate encryption scheme</mark>, like this:

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

In this example, the SQL server will <mark>first decrypt</mark> the `c2_equals` RND ciphertext to the DET cyphertext

Then it will <mark>do a search</mark> for the row where `c2_equals` equals `d3ac...`, where we assume the cyphertext `d3ac...` is the double encryption of 'Alice' with key $K_{t7,c2,Equals,JOIN}$ then with key $K_{t7,c2,Equals,DET}$

The SQL server will <mark>return the `c1_equals` ciphertext</mark> of the selected tow to the client

The <mark>client will then decrypt the return value</mark> using the keys $K_{t7,c2,Equals,RND}$, then $K_{t7,c2,Equals,DET}$, then $K_{t7,c2,Equals,JOIN}$

On completion of the encrypted search, the <mark>value of `c2_equals` is now only doubly encrypted</mark>

Instead of immediately re-encrypting or restoring back to RND, it attempts to <mark>intelligently keep attributes at frequently accessed encryption levels</mark>, and <mark>re-encrypting based on a policy</mark>, to help with performance

Operations like SUM and + are rewritten as server side function calls using HOM

<mark>Key management</mark> is a crucial part of CryptDB
