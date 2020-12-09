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

