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

BGW Is a <mark>multi policy protocol</mark> that compiles the <mark>public function into an arithmetic circuit</mark>, consisting of addition gates multiplication gates

The <mark>circuit</mark> is sent to, or otherwise made known, to <mark>each party</mark> - each party could also compile the function

Before evaluating the circuit, each party will <mark>split its private value into secret shares</mark>, and send one set each party e.g. 4 shares for 4 parties

Each party then <mark>securely evaluate its circuit using the shares it receives</mark>, using them as the values of the input wires of its circuit

The <mark>output of every gate</mark> must also be a <mark>share of the correct evaluation</mark> of the plaintext result of the gate

After evaluation of the circuit, each <mark>party broadcasts the share of the final output gate of its circuit to all parties</mark>

Each party then <mark>combines the shares received</mark> to produce the plaintext result of the function

## Phase 1: Shamir Secret Sharing

The <mark>value of each input wire</mark> and each gate output wire will be hidden using a <mark>random polynomial of degree T</mark> by <mark>sharing the value among N parties</mark>

For each input wire value we apply <mark>Shamir's (T+1 shares from N) threshold secret sharing scheme</mark>:

Given secret S, each party i performs:

- <mark>Selects random coefficients</mark> $a_1, a_2, ..., a_T$
- Defines a <mark>$P_i(x) = S + a_1x + a_2x^2 + ... + a_Tx^T$</mark>
- Sends the share <mark>$S_j = P_i(j)$ to party $j$</mark> - the N shares are known as the sharing of S
- Given T+1 shares, we can combine the shares for a wire to reconstruct a new polynomial P for the wire using Lagrange Interpolation, and then recover the secret S by computing $P(0) = S$

## Phase 2: Evaluating Gates

### Addition Gates

Once the shares of the circuits inputs are distributed, the parties <mark>evaluate the circuit gate by gate</mark>

Each gate will have a share on each of its input wires corresponding to points on a different randomised polynomial

Each gate produces a share on its output wire of either the sum or the product of the input shares, and corresponds to a point on a new randomised polynomial

For an add gate, each party <mark>computes its own share</mark> of the output wire for its input wire shares using <mark>simple modulo prime addition</mark>

This means an add gate requires <mark>no interaction between the parties</mark>

### Multiplication gates

Following multiplication, we need to carry out a <mark>degree reduction step</mark> that reduces the output polynomial of <mark>degree 2T to a new one of degree T</mark>

We also need to <mark>randomise the coefficients</mark> so it can't be factorised by adversaries

Since we know a polynomial of degree 2T can be expressed as a linear combination of 2T + 1 points on the polynomial given its recombination vector, we can apply <mark>Shamir Secret Sharing</mark>

Given a share S, each party i:

- <mark>Selects random coefficient</mark> $a_1, a_2, ..., a_T$
- Defines <mark>$Q_i(x) = S + a_1x + a_2x^2 + ... + a_Tx^T$</mark>
- Sends the sub-share <mark>$S_j = Q_i(j)$ to party $j$</mark>

In contrast to add gates which involve no communication between parties, <mark>$N^2$ messages are sent per mul gate</mark>

## Phase 3: Final Result

Each party <mark>sends its share of the circuit's output wire to every other party</mark>

The parties then <mark>use Lagrange Interpolation</mark> to construct the polynomial $P(x)$ corresponding to the shares received, and <mark>recover the circuit's output value using $P(0) = result$</mark>
