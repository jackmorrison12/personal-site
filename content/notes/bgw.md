---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: BGW Protocol
slug: bgw
topic: 5.3
hidden: false
tags:
  - BGW
---

## What is BGW?

BGW Is a multi policy protocol that compiles the public function into an arithmetic circuit, consisting of addition gates multiplication gates

The circuit is sent to, or otherwise made known, to each party - each party could also compile the function

Before evaluating the circuit, each party will split its private value into secret shares, and send one set each party e.g. 4 shares for 4 parties

Each party then securely evaluate its circuit using the shares it receives, using them as the values of the input wires of its circuit

The output of every gate must also be a share of the correct evaluation of the plaintext result of the gate

After evaluation of the circuit, each party broadcasts the share of the final output gate of its circuit to all parties

Each party then combines the shares received to produce the plaintext result of the function

## Phase 1: Shamir Secret Sharing

The value of each input wire and each gate output wire will be hidden using a random polynomial of degree T by sharing the value among N parties

For each input wire value we apply Shamir's (T+1 shares from N) threshold secret sharing scheme:

Given secret S, each party i performs:

- Selects random coefficients $a_1, a_2, ..., a_T$
- Defines a $P_i(x) = S + a_1x + a_2x^2 + ... + a_Tx^T$
- Sends the share $S_j = P_i(j)$ to party $j$ - the N shares are known as the sharing of S
- Given T+1 shares, we can combine the shares for a wire to reconstruct a new polynomial P for the wire using Lagrange Interpolation, and then recover the secret S by computing $P(0) = S$

## Phase 2: Evaluating Gates

### Addition Gates

Once the shares of the circuits inputs are distributed, the parties evaluate the circuit gate by gate

Each gate will have a share on each of its input wires corresponding to points on a different randomised polynomial

Each gate produces a share on its output wire of either the sum or the product of the input shares, and corresponds to a point on a new randomised polynomial

For an add gate, each party computes its own share of the output wire fro its input wire shares using simple modulo prime addition

This means an add gate requires no interaction between the parties

### Multiplication gates

Following multiplication, we need to carry out a degree reduction step that reduces the output polynomial of degree 2T to a new one of degree T

We also need to randomise the coefficients so it's cant be factorised by adversaries

Since we know a polynomial of degree 2T can be expressed as a linear combination of 2T + 1 points on the polynomial given its recombination vector, we can apply Shamir Secret Sharing

Given a share S, each party i:

- Selects random coefficient $a_1, a_2, ..., a_T$
- Defines $Q_i(x) = S + a_1x + a_2x^2 + ... + a_Tx^T$
- Sends the sub-share $S_j = Q_i(j)$ to party $j$

In contrast to add gates which involve no communication between parties, $N^2$ messages are sent per mul gate

## Phase 3: Final Result

Each party sends its share of the circuit's output wire to every other party

The parties then use Lagrange Interpolation to construct the polynomial $P(x)$ corresponding to the shares received, and recover the circuit's output value using $P(0) = result$
