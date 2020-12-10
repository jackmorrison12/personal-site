---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Fully Homomorphic Encryption
slug: fhe
topic: 6.2
hidden: false
tags:
  - Fully Homomorphic Encryption
---

## What is FHE?

FHE allows anyone (e.g. untrusted cloud providers), not just the key holder, to <mark>output a ciphertext with the encrypted value of $f(P1,...,Pn)$ for any function $f$</mark>

<mark>Inputs, outputs and intermediate values</mark> are <mark>always encrypted</mark>

<mark>No information</mark> about $P1$, $Pn$ or $f$ is <mark>leaked</mark>

- The idea is that we <mark>give some inputs</mark> $P1$ and $Pn$m
- These are <mark>encrypted</mark> with $E$
- Once encrypted, we can <mark>apply function $f$</mark> on them under FHE
- We can then <mark>decrypt the result</mark> with $D$
- We then <mark>get the answer</mark> $f(P1,...,Pn)$

## Partially Homomorphic Encryption

This is similar to FHE, but <mark>for a specific or known function</mark>

It can be <mark>very efficient</mark>

An example is multiplication using RSA:

$E(x) \times E(y) = x^e \times y^e mod\ m = (xy)^e mod\ m = E(x \times y)$

## Gentry's FHE

This was the first fully homomorphic encryption scheme, devised in 2009

$FHE(Circuit, C1, ... , Cn)$

1. $Circuit$ represents a <mark>boolean circuit</mark> for the function we want to evaluate - these can be easily changed to use addition and multiplication gates
2. The circuit <mark>can expand at runtime</mark> - it's not static
3. Encryption is <mark>probabilistic</mark> - each ciphertext value has a <mark>little noise</mark> - however decryption results int he correct plaintext value

A very simple explanation of Gentry's FHE is:

We have <mark>values C1 and C2</mark>, which both have a <mark>little noise</mark>

When we <mark>add the values</mark>, under Gentry's FHE it <mark>doubles the noise</mark>

When we <mark>multiply values</mark>, under Gentry's FHE we <mark>square the noise</mark>

As we do <mark>more operations, the noise grows</mark>, leading to wrong results

In order to control the noise, Gentry <mark>resets the ciphertext values</mark> if they get <mark>too noisy</mark> (above a threshold)

This is done by <mark>decrypting and re-encrypting</mark> it so it has less noise - but this needs a secret decryption key!

So, since FHE is capable of executing any function, it executes the decrypt function

Gentry <mark>encrypts the secret key with itself</mark> and <mark>passes it to the FHE</mark> so that the noise reset is done by <mark>decrypting with the encrypted key within FHE</mark>

## Comparison with MPC

|                            | MPC                               | FHE                |
| -------------------------- | --------------------------------- | ------------------ |
| **Computation Overhead**   | Low                               | High               |
| **Communication Overhead** | High                              | Low                |
| **Practicality**           | Increasing number of applications | Mostly impractical |

## One-Time Programs

Another idea is to have a <mark>1-time program</mark>, which takes some <mark>input</mark>, <mark>executes it</mark>, and then <mark>self-destructs</mark>

<mark>Only the result</mark> of the program is disclosed, nothing about the programs implementation

This could be extended to a k-time program

It's <mark>not possible to do this with software</mark>, so it has to be <mark>implemented in hardware</mark> using one-time memory

This is tamperproof and can withstand side-channel attacks

1. Locations that are <mark>never accessed</mark> are <mark>never leaked by a side channel</mark>
2. Locations that are <mark>accessed are immediately leaked</mark>
3. Also includes a <mark>single tamper-proof bit</mark>

It's inspired by 1-from-2 oblivious transfers

You <mark>initialise</mark> the OTM with <mark>two keys: $K0$ and $K1$</mark>, and a <mark>tamperproof bit $x$</mark>, which is set to 0

If <mark>$x = 0$</mark>, then <mark>set $x$ to 1</mark>, <mark>accept $b$</mark>, <mark>output $Kb$</mark>

Elif <mark>$x = 1$</mark>, <mark>output error</mark>

<mark>$K_{1-b}$ is never accessed</mark>

We can <mark>construct a program</mark> from this using <mark>garbled circuits</mark>

1. Convert a <mark>program into a boolean circuit</mark>
2. <mark>Garble</mark>
3. Use <mark>n OTMs</mark> and put the i-th key pair in the i-th OTM
4. <mark>Retrieve keys</mark> from OTMs during evaluation of the circuit
