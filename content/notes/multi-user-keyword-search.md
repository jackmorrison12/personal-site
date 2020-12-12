---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Multi-User Keyword Search
slug: multi-user-keyword-search
topic: 7.2
hidden: false
tags:
  - Multi-User Keyword Search
---

## What Problems do Multi-User Databases Solve?

CryptDB is based on secret keys shared by clients

If a <mark>key needs to be revoked</mark>, e.g. to remove a user, then <mark>all the data</mark> in the databases needs to be <mark>re-encrypted</mark>, which is inefficient

Therefore, the aims of multi-user databases are to:

- Allow <mark>multiple users to insert/update/search/read data</mark>
- <mark>Without sharing keys</mark>
- Easily <mark>add or revoke users</mark> without re-encrypting data
- Use <mark>keys to authenticate users</mark>

## Shared and Searchable Data Spaces

This is an example of a multi-user database

<mark>New users can easily be added</mark> and <mark>keys can be revoked</mark> without affecting other users

Keys are not shared - they can be used to authenticate users

It uses an RSA-based proxy re-encryption scheme where:

- Data <mark>encrypted by Alice</mark> is <mark>re-encrypted by the server</mark>
- <mark>Re-encrypted data</mark> can be <mark>decrypted by Bob</mark>
- Server and Bob don not know Alice's keys
- Server is assumed to be honest-but-curious - it executes instructions faithfully but may be curious about what's stored or being searched for
- Clients are assumed to be trusted
- A <mark>trusted key management service</mark> generates key material for users

The stages are:

- A trusted key management service constructs a <mark>master RSA key pair</mark> $(e, n)$ and $(d, n)$ and then
- For each user A:
  - The key management service constructs <mark>two new key pairs</mark> from the master RSA key pair - one for the <mark>user</mark> and one for the <mark>DB server</mark>
    - User key pair 1: $Ae1 = (e1, n)$ and $Ad1 = (d1, n)$ is sent to the user
    - DB key pair 2: $Ae2 = (e2, n)$ and $Ad2 = (d2, n)$ is sent to the DB
  - Such that:
    - $e1 \times e2 = e\ mod\ (p-1)(q-1)$
    - $d1 \times d2 = d\ mod\ (p-1)(q-1)$
- <mark>Alice encrypts the text</mark> to be stored with a symmetric key $k$
- Alice then <mark>encrypts the symmetric key</mark> $k$ with her public key $Ae1$
- Alice also <mark>hashes any keywords</mark> in the text and <mark>encrypts each hash value</mark> with $Ae1$
- Alice <mark>sends the encrypted text</mark>, <mark>encrypted key</mark> and <mark>encrypted hash keywords</mark> to the DB server
- The DB server <mark>re-encrypts the encrypted key and encrypted hash keywords</mark> with $Ae2$ (so they are now <mark>effectively encrypted with the master RSA encryption key</mark> $e$) and stores them, along with the encrypted text
- Bob <mark>hashes his search keyword</mark> and <mark>encrypts it with his public key</mark> $Be1$ and sends to the DB server as a query
- The DB server <mark>re-encrypts Bob's encrypted hashed keyword again</mark> with $Be2$ - the query is now <mark>effectively $hash(keyword)^e$</mark>
- The DB server does a <mark>search on the query</mark> to <mark>retrieve the matching encrypted text plus its encrypted symmetric key</mark>
- The DB server then <mark>decrypts the doubly encrypted key</mark> $k$ with $Be2$ and sends it to Bob along with the encrypted text
- Bob <mark>decrypts the key again</mark> with $Bd1$ to get $k$ and then uses $k$ to decrypt the encrypted text
