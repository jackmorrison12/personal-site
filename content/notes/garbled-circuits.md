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

However, for Bob to get his encrypted input key, we need to do the oblivious transfer protocol

Bob runs a 1-from-2 oblivious transfer protocol with Alice for each of Bob's input bits. This will get the keys which correspond to Bob's input bits from Alice without her learning which keys Bob got

Alice doesn't learn $b$, and so will not know if she sent $L[B,0]$ or $K[B,1]$

If Alice's input was $a=0$, then she would send $K[A,0]$ to Bob, and if Bob's input was $b=1$, then Bob would doubly decrypt the garbled gate entry for $[0,1]$ first using $K[A,0]$ then using $K[B,1]$ to get $K[C,0]$

To complete the evaluation, Bob uses the decryption mapping table to learn the what the final encrypted result means, and sends this to Alice

## 1-from-2 Oblivious Transfer Protocol

In a 1-from-2 oblivious transfer protocol, the sender (Alice) has two messages $m0$ and $m1$, and the receiver has one selection bit %b%

On completion, Bob received $mb$ without alice learning %b%

Alice does not learn which message Bob received, and Bob doesn't learn what the other message was

It can be extended to 1-from-n and k-from-n

An example would be:

- Alice generates two public-private key pairs (Pub1, Priv1), (Pub2, Priv2)
- Alice sends Pub1 and Pub2 to Bob
- Bob generates a symmetric key $k$ and chooses Pub1 (so he gets back $m1$)
- Bob then sends alice $c=E_{Pub1}(k)$
- Alice does $D_{Priv1}(c) = k$, and $D_{Priv2}(c) = u$, where $k$ is Bob's key and $u$ is not
- Alice then sends back to Bob $c1=E_k(m1)$ and $c2=E_u(m2)$
- Bob does $D_k(c1) = D_k(E_k(m1)) = m1$ and $D_k(c2) = D_k(E_u(m2)) = not m1$, and so now has his input

## Point-and-Permute p-bit

Bob needs to be ble to know which entry of a permuted garbled table should be decrypted, since the permutation is random

He could do this by decrypting each entry, but this is inefficient and inelegant

The trick is therefore to pair a random point-and-permute bit and its inverse (p-bot) to each of te keys of the wire

If a wire $A$ had the keys $k[A,0]$ and $k[A,1]$, we would not have ($k[A,0]$, p-bit) and ($k[A,1]$, not p-bit)

Bob will use the p-bit elements of the input wire pair to index the garbled table and select the correct keys

For example, in order to encrypt a gate with wires $A$ and $B$ whose p-bit elements are $pA$ and $pB$, Bob will doubly decrypt the entry at position $[pA, pB]$ with they keys $key[wireA, pA]$ and $key[wireB, pB]$

This allows Alice to generate a random permuted garbled table, but will allow Bob to decrypt the correct entry

However, this makes the construction of the permuted garbled truth table a little more complicated

For each garbled table entry $[a,b]$, the garbler now uses $[x,y]$ instead

$[x,y]$ is used to:

1. Select the keys to use for double-decryption, i.e. $key[A,x]$ and $key[B,y]$
2. As inputs for the gate function, i.e. $x=GATE(x,y)$

The result fot he gate, $z$, is used to determine the (key, pbit) pair to use at the fate that the output wire is connected to

## Performance

It runs in a constant number of rounds

Computation cost is dominated by the encryption function used (typically hardware-assisted AES)

It has high communication costs - the time to transfer the circuit plus the time to complete the oblivious transfers
