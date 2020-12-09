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

Given $n$ parties, we can design a protocol which <mark>computes a public function</mark> $f$ over <mark>inputs from each party</mark> such that the <mark>inputs remain private</mark> unless they would be revealed by the function in any way

The <mark>same function</mark> is computed for each party, and they all <mark>receive the same output</mark>

The protocol should be equivalent to a protocol that uses a trusted 3rd party which computes the party, but MPC is used when the users don't trust each other or a third party

Some applications include auctions, e-voting ML and genomics

## Example MPC Setups

### Joint Processing

<mark>2 or more parties</mark> run the MPC protocol <mark>directly</mark>

They somehow <mark>share their inputs</mark>, do the <mark>computation</mark> and <mark>receive the results</mark>

The two main approaches are <mark>Garbled Circuits and Secret Sharing</mark>

### Outsources Services

The MPC protocol is use to perform the <mark>private computation on a small cluster of untrusted servers</mark>

These <mark>collect private inputs</mark> from clients, <mark>jointly perform the computation</mark> and <mark>send the results back</mark>, possible to different clients

Secret Sharing is typically used for this

### Homomorphic Encryption

This is not MPC, and can be used when a client wishes to <mark>outsource the storage and processing</mark> of its private data to an <mark>untrusted server</mark>

Input and output data remain <mark>private to the client</mark>

<mark>Partial HE</mark> schemes support a <mark>limited number of operations</mark>, but have <mark>efficient implementation</mark>

<mark>Fully HE schemes</mark> support a <mark>Turing-complete set of operations</mark>, but are very very <mark>inefficient</mark>

## Secret Sharing vs Garbled Circuits

<mark>Secret Sharing</mark>:

- Express the function to be computed as an <mark>arithmetic circuit</mark>
- Better suited for <mark>multi-party (3+) outsource service setups</mark>
- Secret sharing has <mark>high communication costs</mark> so we need to keep the number of parties low
- An example is <mark>BGW</mark>

<mark>Garbled Circuits</mark>:

- Express the function to be computed as an <mark>"encrypted" boolean circuit</mark>
- Garbled Circuits are more efficient than for 2-party joint processing setups, but they get <mark>more complex for more parties</mark>
- An example is <mark>Yao's Garbled Circuits protocol</mark> for 2-parties

## Adversarial Models

<mark>Honest-but-curious</mark> / Semi-Honest / Passive:

- Parties <mark>follow protocol</mark>, but are interested in breaking the privacy of others
- Can <mark>collude</mark> with other parties
- Said to be a corrupt party

<mark>Malicious</mark> / Byzantine / Active:

- Parties can <mark>deviate from the protocol</mark> (e.g. lie about inputs, quit protocol early)
- Can also collude with other parties

BGW is <mark>information theoretically secure</mark>, so:

- For <mark>honest-but-curious parties</mark>, it can tolerate a minority <mark>($< \frac{n}{2}$)</mark> of corrupt parties
- For <mark>malicious parties</mark>, it can tolerate <mark>$< \frac{n}{3}$</mark> corrupt parties

<mark>Information theoretically secure</mark>:

- System cannot be broken even if adversary has <mark>unlimited computational power</mark> (also known as perfect or unconditional security)

<mark>Computationally Secure</mark>:

- Adversary would require an <mark>unreasonable large amount of computational power</mark> to break the system

## Examples

### Privacy-Preserving Average Salary

A group of people wish to <mark>calculate the average salary without anyone learning the salary of anyone else</mark>

Salaries of Alice, Bob, Carol and Dave are $a$, $b$, $c$ and $d$

Alice generates a <mark>large secret random number</mark> $r$ and then initiates the protocol:

Alice $\rightarrow$ Bob: $E_{Bob}(a+r)$ - Bob Decrypts to get $a + r$

Bob $\rightarrow$ Carol: $E_{Carol}(a+r+b)$ - Carol Decrypts to get $a + r + b$

Carol $\rightarrow$ Dave: $E_{Dave}(a+r+b+c)$ - Dave Decrypts to get $a + r + b + c$

Dave $\rightarrow$ Alice: $E_{Alice}(a+r+b+c+d)$ - Alice Decrypts to get $a + r + b + c + d$

Alice <mark>subtracts $r$ to get the total</mark>, divides by 4 and <mark>informs everyone</mark> of the average

We assume all parties are available and know the topology, and that <mark>public keys are available</mark>

<mark>Kerchoff's principle applies</mark>: the <mark>algorithm is public knowledge</mark>, since security is based on cryptographic values that are kept secret, such as a decryption key

<mark>Security through obscurity</mark> is not an approach advocated for

However, there are many issues with this, e.g.:

- People can <mark>lie</mark>
- Alice is the only one who gets the average - she many lie
- <mark>2 people can collude</mark> to get the result of the intermediate person
- It's easy to spot a really far off <mark>outlier</mark>

### Privacy-Preserving Voting

Say we have <mark>3 votes</mark>, $V1$, $V2$ and $V3$, and we want to <mark>calculate the number of Yes votes</mark>

Alice generates <mark>2 random number</mark> $V12$ and $V13$ int he range $0..p$, where $p$ is a large prime

Alice computes <mark>$V11 = V1 - V12 - V13\ (mod\ p)$</mark>

The <mark>$Vxy$ values are the shares of $Vx$</mark>

Alice sends $(V11, V13)$ to Bob and $(V11, V12)$ to Carol, and they do the same

Now we have:

Alice = $(V11, V12, V13), (\_\_, V22, V23), (\_\_, V32, V33)$

Bob = $(V11, \_\_, V13), (V21, V22, V23), (V31, \_\_, V33)$

Carol = $(V11, V12, \_\_), (V21, V22, \_\_), (V31, V32, V33)$

They can therefore <mark>vertically compute a share</mark> (e.g. for Alice, she can use $V12, V22, V32$ to generate $S2$)

The final tally is then computed by doing <mark>$S1 + S2 + S3\ (mod\ p)$</mark>

### Yao's Millionaires' Problem

This is the problem which led to garbled circuits

Two millionaries want to know <mark>who is richer without disclosing their wealth</mark>

Alice's value is $a$, Bob's is $b$

<mark>Bob chooses a large random number</mark> $r$ (his secret) and <mark>encrypts it with Alice public key</mark> $EpubA(r)$

Bob sends <mark>$c=EpubA(r) - b$ to Alice</mark> - C is an encryption of Bob's secret

<mark>Alice decrypts 6 values</mark>, $Y[k] = DprivA(C + k)$ for k=1..6, so for <mark>each possible value</mark>

Alice then generates a <mark>large random prime</mark> $p$ where $p < r$ and reduces the decrypted values $Y[k]$ mod $p$

$Z[k] = Y[k] mod p$

Alice checks that all the elements of $Z$ <mark>differ from each other by at least 2</mark>, otherwise she repeats with another prime

Alice then <mark>sends $p$ plus the list</mark> $[Z1, Z2, Z3, Z4, Z5+1, Z6+1]$ to Bob, where <mark>all values after the $a$-th position (her value) have 1 added</mark>

Bob then <mark>checks if the $b$-th value is his secret</mark>, so if $List[b] \equiv r (mod\ p)$

If it is <mark>congruent, the $b \leq a$</mark>, otherwise $b > a$

<mark>Bob tells Alice</mark> who is richer
