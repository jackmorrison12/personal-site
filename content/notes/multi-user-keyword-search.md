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

If a key needs to be revoked, e.g. to remove a user, then all teh data in the databases needs to be re-encrypted, which is inefficient

Therefore, the aims of multi-user databases are to:

- Allow multiple users to insert/update/search/read data
- Without sharing keys
- Easily add or revoke users without re-encrypting data
- Use keys to authenticate users

## Shared and Searchable Data Spaces

This is an example of a multi-user database

New users can easily be added and keys can be revoked without affecting other users

Keys are not shared - they can be used to authenticate users

It uses an RSA-based proxy re-encryption scheme where:

- Data encrypted by Alice is re-encrypted by the server
- Re-encrypted data can be decrypted by Bob
- Server and Bob don not know Alice's keys
- Server is assumed to be honest-but-curious - it executes instructions faithfully but may be curious about what's stored or being searched for
- Clients are assumed to be trusted
- A trusted key management service generates key material for users

The stages are:

- A trusted key management service constructs a master RSA key pair $(e, n)$ and $(d, n)$ and then
- For each user A:
  - The key management service constructs two new key pairs from the master RSA key pair - one for the user and one for the DB server
    - User key pair 1: $Ae1 = (e1, n)$ and $Ad1 = (d1, n)$ is sent to the user
    - DB key pair 2: $Ae2 = (e2, n)$ and $Ad2 = (d2, n)$ is sent to the DB
  - Such that:
    - $e1 \times e2 = e\ mod\ (p-1)(q-1)$
    - $d1 \times d2 = d\ mod\ (p-1)(q-1)$
- Alice encrypts the text to be stored with a symmetric key $k$
- Alice then encrypts the symmetric key $k$ with her public key $Ae1$
- Alice also hashes any keywords in the text and encrypts each hash value with $Ae1$
- Alice sends the encrypted text, encrypted key and encrypted hash keywords to the DB server
- The DB server re-encrypts the encrypted key and encrypted hash keywords with $Ae2$ (so they are now effectively encrypted with the master RSA encryption key $e$) and stores them, along with the encrypted text
- Bob hashes his search keywords and encrypts it with his public key $Be1$ and sends to the DB server as a query
- The DB server re-encrypts Bob's encrypted hashed keyword again with $Be2$ - the query is now effectively $hash(keyword)^e$
- The DB server does a search on the query to retrieve the matching encrypted text plus its encrypted symmetric key
- The DB server then doubly encrypted key $k$ with $Bd2$ and sends it to Bob along with the encrypted text
- bob decrypts the key again with $Bd1$ to get $k$ and then uses $k$ to decrypt the encrypted text
