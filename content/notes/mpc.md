---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Multi-Party Computation
slug: mpc
topic: 5.1
hidden: false
tags:
  - MPC
---

## What is MPC?

Given $n$ parties, we can design a protocol which computes a public function $f$ over inputs from each party such that the inputs remain private unless they would be revealed by the function in any way
The same function is computed for each party, and they all receive the same output

The protocol should be equivalent to a protocol that uses a trusted 3rd party which computes the party, but MPC is used when the users don't trust each other or a third party

Some applications include auctions, e-voting ML and genomics

## Example MPC Setups

### Joint Processing

2 or more parties run the MPC protocol directly

They somehow share their inputs, do the computation and receive the results

The two main approaches are Garbled Circuits and Secret Sharing

### Outsources Services

The MPC protocol is use to perform the private computation on a small cluster of untrusted servers

These collect private inputs from clients, jointly perform the computation and send the results back, possible to different clients

Secret Sharing is typically used for this

### Homomorphic Encryption

This is not MPC, and can be used when a client wishes to outsource the storage and processing of its private data to an untrusted server

Input and output data remain private to the client

Partial HE schemes support a limited number of operations, but have efficient implementation

Fully HE schemes support a Turing-complete set of operations, but are very very inefficient

## Secret Sharing vs Garbled Circuits

Secret Sharing:

- Express the function to be computed as an arithmetic circuit
- better suited for multi-party (3+) outsources service setups
- Secret sharing has high communication costs so we need to keep the number of parties low
- An example is BGW

Garbled Circuits:

- Express the function to be computed as an "encrypted" boolean circuit
- Garbled Circuits are more efficient than for 2-party joint processing setups, but they get more complex for more parties
- An example is Yao's Garbled Circuits protocol for 2-parties

## Adversarial Models

Honest-but-curious / Semi-Honest / Passive:

- Parties follow protocol, but are interested in breaking the privacy of others
- Can collude with other parties
- Said to be a corrupt party

Malicious / Byzantine / Active:

- Parties can deviate from the protocol (e.g. lie about inputs, quit protocol early)
- Can also collude with other parties

BGW is information theoretically secure, so:

- For honest-but-curious parties, it can tolerate a minority ($< \frac{n}{2}$) of corrupt parties
- For malicious parties, it can tolerate $< \frac{n}{3}$ corrupt parties

Information theoretically secure:

- System cannot be broken even if adversary has unlimited computational power (also known as perfect or unconditional security)

Computationally Secure:

- Adversary would require an unreasonable large amount of computational power to break the system

## Examples

### Privacy-Preserving Average Salary

A group of people wish to calculate the average salary without anyone learning the salary of anyone else

Salaries of Alice, Bob, Carol and Dave are $a$, $b$, $c$ and $d$

Alice generates a large secret random number $r$ and then initiates the protocol:

Alice $\rightarrow$ Bob: $E_{Bob}(a+r)$ - Bob Decrypts to get $a + r$

Bob $\rightarrow$ Carol: $E_{Carol}(a+r+b)$ - Carol Decrypts to get $a + r + b$

Carol $\rightarrow$ Dave: $E_{Dave}(a+r+b+c)$ - Dave Decrypts to get $a + r + b + c$

Dave $\rightarrow$ Alice: $E_{Alice}(a+r+b+c+d)$ - Alice Decrypts to get $a + r + b + c + d$

Alice subtracts $r$ to get the total, divides by 4 nd informs everyone of the average

We assume all parties are available and know the topology, and that public keys are available

Kerchoff's principle applies: the algorithm is public knowledge, since security is based on cryptographic values that are kept secret, such as a decryption key

Security through obscurity is not an approach advocated for

However, there are many issues with this, e.g.:

- People can lie
- Alice is the only one who gets the average - she many lie
- 2 people can collude to get the result of the intermediate person
- It's easy to spot a really far off outlier

### Privacy-Preserving Voting

Say we have 3 votes, $V1$, $V2$ and $V3$, and we want to calculate the number of Yes votes

Alice generates 2 random number $V12$ and $V13$ int he range $0..p$, where $p$ is a large prime

Alice computes $V11 = V1 - V12 - V13\ (mod\ p)$

The $Vxy$ values are the shares of $Vx$

Alice sends $(V11, V13)$ to Bob and $(V11, V12)$ to Carol, and they do the same

Now we have:

Alice = $(V11, V12, V13), (\_\_, V22, V23), (\_\_, V32, V33)$

Bob = $(V11, \_\_, V13), (V21, V22, V23), (V31, \_\_, V33)$

Carol = $(V11, V12, \_\_), (V21, V22, \_\_), (V31, V32, V33)$

They can therefore vertically compute a share (e.g. for Alice, she can use $V12, V22, V32$ to generate $S2$)

The final tally is then computed by doing $S1 + S2 + S3\ (mod\ p)$

### Yao's Millionaires' Problem

This is the problem which led to garbled circuits

Two millionaries want to know who is richer without disclosing their wealth

Alice's value is $a$, Bob's is $b$

Bob chooses a large random number $r$ (his secret) and encrypts it with Alice public key $EpubA(r)$

Bob sends $c=EpubA(r) - b$ to Alice - C is an encryption of Bob's secret

Alice decrypts 6 values, $Y[k] = DprivA(C + k)$ for k=1..6, so for each possible value

Alice then generates a large random prime $p$ where $p < r$ and reduces the decrypted values $Y[k]$ mod $p$

$Z[k] = Y[k] mod p$

Alice checks that all the elements of $Z$ differ from each other by at least 2, otherwise she repeats with another prime

Alice then sends $p$ plus the list $[Z1, Z2, Z3, Z4, Z5+1, Z6+1]$ to Bob, where all values after the $a$-th position (her value) have 1 added

Bob then checks if the $b$-th value is his secret, so if $List[b] \equiv r (mod\ p)$

If it is congruent, the $b \leq a$, otherwise $b > a$

Bob tells Alice who is richer
