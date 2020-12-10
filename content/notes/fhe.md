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

FHE allows anyone (e.g. untrusted cloud providers), not just the key holder, to output a ciphertext with the encrypted value of $f(P1,...,Pn)$ for any function $f$

Inputs, outputs and intermediate values are always encrypted

No information about $P1$, $Pn$ or $f$ is leaked

- The idea is that we give some inputs $P1$ and $Pn$m
- These are encrypted with $E$
- Once encrypted, we can apply function $f$ on them under FHE
- We can then decrypt the result with $D$
- We then get the answer $f(P1,...,Pn)$

## Partially Homomorphic Encryption

This is similar to FHE, but for a specific or known function

It can be ver efficient

An example is multiplication using RSA:

$E(x) \times E(y) = x^e \times y^e mod\ m = (xy)^e mod\ m = E(x \times y)$

## Gentry's FHE

This was the first fully homomorphic encryption scheme, devised in 2009

$FHE(Circuit, C1, ... , Cn)$

1. $Circuit$ represents a boolean circuit for the function ew want to evaluate - these can be easily changed to use addition and multiplication gates
2. The circuit can expand at runtime - it's not static
3. Encryption is probabilistic - each ciphertext value has a little noise - however decryption results int he correct plaintext value

A very simple explanation of Gentry's FHE is:

We have values C1 and C2, which both have a little noise

When we add the values, under Gentry's FHE it doubles the noise

When we multiple values, under Gentry's FHE we square the noise

As we do more operations, he noise grows, leading to wrong results

In order to control the noise, Gentry resets the ciphertext values if they get too noise (above a threshold)

This is done by decrypting and re-encrypting it so it has less noise - but this needs a secret decryption key!

So, since FHE is capable of executing any function, it executed the decrypt function

Gentry encrypts the secret key with itself and passes it to the FHe so that the noise reset is done by decrypting with the encrypted key within FHE

## Comparison with MPC

|                            | MPC                               | FHE                |
| -------------------------- | --------------------------------- | ------------------ |
| **Computation Overhead**   | Low                               | High               |
| **Communication Overhead** | High                              | Low                |
| **Practicality**           | Increasing number of applications | Mostly impractical |

## One-Time Programs

Another idea is to have a 1-time program, which takes some input, execites it, and then self-destructs

Only the result of the program is disclosed, nothing about the programs implementation

This could be extended to a k-time program

It's not possible to do this with software, so it has to be implemented in hardware using one-time memory

This is tamperproof and can withstand side-channel attacks

1. Locations that are never accessed are never leaked by a side channel
2. Locations that are accessed are immediately leaked
3. Also includes a single tamper-proof bit

It's inspired by 1-from-2 oblivious transfers

You initialise the OTM with two keys: $K0$ and $K1$, and a tamperproof bit $x$, which is set to 0

If $x = 0$, then set $x$ to 1, accept $b$, output $Kb$

Elif $x = 1$, output error

$K_{1-b}$ is never accessed

We can construct a program from this using garbled cirrcuits

1. Convert a program into a boolean circuit
2. Garble
3. Use n OTMs and put the i-th key pair in the i-th OTM
4. Retrieve keys from OTMs during evaluation of the circuit
