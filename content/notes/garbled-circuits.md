---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Garbled Circuits
slug: garbled-circuits
topic: 6.1
hidden: false
tags:
  - Garbled Circuits
---

## Overview

Garbled circuits are a general approach used to perform a <mark>privacy preserving MPC</mark>

The aim is to <mark>compute a function</mark> $f(x,y)$ where $x$ is Alice's input and $y$ is Bob's input, such that these <mark>remain private</mark> unless revealed by the function $f$

Let Alice be the garbler and Bob be the evaluator

The 9 stages of a garbled circuit are:

1. Alice compiles her function to a <mark>boolean circuit</mark>
2. The <mark>circuit is garbled</mark>
3. The garbled circuit is supplemented with the <mark>encrypted inputs and decryption mapping</mark>
4. These are all <mark>sent to Bob</mark>
5. Bob sends y to an <mark>oblivious transfer protocol</mark>
6. Alice also sends to the protocol
7. Bob receives the <mark>encrypted version of y back</mark> from the protocol
8. Bob <mark>evaluates the circuit</mark> under encryption
9. Bob uses the decryption mapping to <mark>decrypt the result and send it to Alice</mark>

## One Gate Garbled Circuit

For each of three wires of the AND gate (2 input, 1 output):

- Alice created 2 random keys
- One key corresponds to 0, the other to 1
- So $k[A,0]$ corresponds to 0 for the wire A
- She then computes a garbled truth table for the gate, where each entry in the table is the key which corresponds to the output of the logical operation, doubly encrypted with the appropriate input keys:

$GT [0,0] = E_{k[A,0],k[B,0]}(k[C, AND(0,0)])$

$GT [0,1] = E_{k[A,0],k[B,1]}(k[C, AND(0,1)])$

$GT [1,0] = E_{k[A,1],k[B,0]}(k[C, AND(1,0)])$

$GT [1,1] = E_{k[A,1],k[B,1]}(k[C, AND(1,1)])$

- She then randomly permutes the entries of the garbled table, since the order would leak information otherwise
- She then sends the permuted table to Bob
- Bob doesn't know which row of the garbled table corresponds to which row in the original table
- Alice also sends the key corresponding to her plain text input bit to Bob
- For example, if her input bit is 0, she sends $k[A,0]$ - Bob won't know this corresponds to - since all wire keys are random
- Alice also sends a Decryption Mapping Table, which maps the keys of the circuit's output wire to their plaintext values, so in this case:
  - $k[C,0]$ corresponds to 0
  - $k[C,1]$ corresponds to 1

However, for Bob to get his encrypted input key, we need to oblivious transfer protocol
