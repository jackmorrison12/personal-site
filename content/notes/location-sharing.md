---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Location Sharing
slug: location-sharing
topic: 7.3
hidden: false
tags:
  - Location Sharing
---

## Longitude

Longitude is a <mark>privacy-preserving location sharing service</mark> for mobile applications

Alice shares her location with Bob via a <mark>location sharing provider Luke</mark> (who is honest-but-curious)

Alice defines the <mark>degree of precision</mark> for Bob, plus <mark>at what times</mark> Bob can see her location (a policy)

Most computational cryptographic tasks are performed by Luke, since this saves on communication and battery

Alice's cryptographic material can be pre-computed when her phone is charging

Alice only encrypts new location data once, regardless of the number fo friends she is sharing her location with

### Stages

It's based on <mark>proxy re-encryption</mark> - this is where a <mark>cyphertext encrypted once by one key</mark> can be <mark>transformed by a proxy function</mark> into the <mark>corresponding ciphertext for another key</mark> without revealing any information about the keys and the plaintext

1. <mark>Setup & Registration</mark> - to share her location with Bob, Alice and Bob must first <mark>register with the location service provider</mark> Luke. During registration, Alice and Bob also obtain public cryptographic parameters and <mark>generate a public/private key pair locally</mark> on their mobile devices
2. <mark>Sharing Request</mark> - After registration, Bob can <mark>send a request</mark> to Alice to share her location with him. The request can be done out of band without involving Luke. In the request, Bob <mark>provides a copy of his public key</mark>
3. <mark>Sharing Authorisation</mark> - If Alice agrees, she <mark>computes a re-encryption key</mark> using Bob's public key and her own private key. Alice also decides how accurate the location should be for bob, and generates a corresponding precision mask. The <mark>re-encryption key and the precision mask are sent to Luke</mark>, and act as an authorisation policy that allows Bob to retrieve Alice's location
4. <mark>Location Updates</mark> - Alice can now <mark>send encrypted location data to Luke</mark>. Bob's public key can also be discarded by Alice. Luke only stores a user's most recent location. The previous location is overwritten by a newly received location
5. <mark>Location Retrieve</mark> - When Bob wants to know where Alice is, he <mark>sends a request to Luke</mark>, who <mark>retrieves Alice's last encrypted location</mark>, applies the <mark>re-encryption key</mark> and policies defined by Alice, and then sends it to Bob. Bob can then decrypt the location received from uke and process as needed

### Precision of Encrypted Location

Latitude and Longitude coordinates are represented as a <mark>pair of decimal numbers</mark>

5 decimal places is precise to ~1m, 2 decimal places is precise to ~11m, 3 to 111m etc.

Alice encodes each coordinate as an 11 character strong S111FFFFFFF (sign, integer, fraction), e.g. 51.49875 would be encoded +0514987500

This is converted into bits and XORed with a random bit stream

The <mark>encrypted coordinate is truncated</mark> by Luke when sending location to Bob, respecting Alice's policy

Luke doesn't need to decrypt the data to do this - he does it <mark>blindly</mark>

### Friend Revocation

To stop Bob from being able to access Alice's location, Alice could <mark>ask Luke to stop sending him updates</mark> - i.e. Luke remove the AliceBob re-encryption key RKab

However, if Luke and Bob collude, this may not work

To prevent this, Alice can <mark>generate a new public-private keypair</mark> using <mark>parts of the old keypair</mark> and new <mark>re-encryption keys using parts of the old re-encryption keys</mark> for her remaining location-sharing friends

### Proxy Re-encryption

Longitude's proxy re-encryption scheme is based on <mark>symmetric bilinear pairings</mark> that pair two elements from one group to an element of a second group

$G_1$ and $G_2$ are two cyclic groups of prime order $q$

$g$ is the generator for $G_1$

The bilinear pairing $e: G_1 \times G_1 \rightarrow G_2$ has the following properties:

- <mark>Bilinearity</mark> - for all $u, v \in G_1.\ a, b \in \Z q$ we have $e(u^a,v^b)=e(u,v)^{ab}$
- <mark>Non-degeneracy</mark> - $e(g,g) \neq 1$
- <mark>Computable</mark> - There exists an efficient algorithm to compute $e(u,v)$ for all $u, v \in G_1$

The stages are:

1. <mark>Setup</mark> - Luke generates public parameters (e.g. $G1$, $G2$) where $e$ is a bilinear pairing from $G1 \times G2 \rightarrow G2$, $g$ is the generator for $G1$
2. <mark>Alice's Key Generation</mark> - Alice generates her public key $pk_a = (h_{a1}, h_{a1}, Z_a)$ and her private key $sk_a = (x_a, y_a)$ using $e$, $g$ and 3 random numbers $x_a$, $y_a$, $z_a$
3. <mark>Re-encryption for Bob</mark> - Alice generates a re-encryption key $rk_{a\rightarrow b}$ for her friend Bob. This is generated using values from Alice ($h_{a2}^{-x_a}$) and Bob $h_{b1}$. Luke will be able to use Alice's encrypted locations plus two elements of the Alice's re-encryption key for Bob to re-encrypt the location such that Bob will be able to recover it
4. <mark>Alice updates the encrypted location</mark> - she encrypts her location $m$ using $Z_a$, $g$ and a random number $r_a$ and sends the resulting pair of values to Luke
5. <mark>Luke re-encrypts Alice's encrypted location for Bob</mark> - when Bob asks for Alice's location, Luke will re-encrypt Alice's encrypted location using both elements of Alice's encrypted location, and both elements of Alice's re-encryption key for Bob. The resulting cyphertext $c1$ and $c2$ are sent to Bob
6. <mark>Decrypt</mark> - on receipt, Bob decrypts $c1$ and $c2$ using an element $y_b$ of his private key. $y_b$ is related to $h_{b1}$ since $h_{b1} = g^{y_b}$
