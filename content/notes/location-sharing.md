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

Longitude is a privacy-preserving location sharing service for mobile applications

Alice shares her location with bob via a location sharing provider Luke (who is honest-but-curious)

Alice defines the degree of precision for Bob, plus at what times Bob can see her location (a policy)

Most computational cryptographic tasks are performed by Luke, since this saves on communication and battery

Alice cryptographic material can be pre-computed when her phone is charging

Alice only encrypts new location data once, regardless of the number fo friends she is sharing her location with

### Stages

It's based on proxy re-encryption - this is where a cyphertext encrypted once by one key can be transformed by a proxy function into the corresponding ciphertext for another key without revealing any information about the keys and the plaintext

1. Setup & Registration - to share her location with Bob, alice and Bob must first register with the location service provider Luke. During registration, Alice and Bob also obtain public cryptographic parameters and generate a public/private key pair locally on their mobile devices
2. Sharing Request - After registration, Bob can send a request to Alice to share her location with him. The request can be done out of band without involving Luke. In the request, bob provides a copy of his public key
3. Sharing Authorisation - If Alice agrees, she computes a re-encryption key using Bob's public key and her own private key. Alice also decides how accurate the location should be for bob, and generates a corresponding precision mask. The re-encryption key and the precision mask are sent to Luke, and act as an authorisation policy that allows Bob to retrieve Alice's location
4. Location Updates - Alice can now send encrypted location data to Luke. Bob's public key can also be discarded by Alice. Luke only stores a user's most recent location. The previous location is overwritten by a newly received location
5. Location Retrieve - When Bob wants to know where Alice is, he sends a request to Luke, who retrieves Alice's last encrypted location, applies the re-encryption key and policies defined by Alice, and then sends it to Bob. Bob can then decrypt the location received from uke and process as needed

### Precision of Encrypted Location

Latitude and Longitude coordinates are represented as a pair of decinal numbers

5 decimal places is precise to ~1m, 2 decimal places is precise to ~11m, 3 to 111m etc.

Alice encodes each coordinate as an 11 character strong S111FFFFFFF (sign, integer, fraction), e.g. 51.49875 would be encoded +0514987500

This is converted into bits and xored with a random bit stream

The encrypted coordinate is truncated by Luke when sending location to Bob, respecting Alice's policy

Luke doesn't need to decrypt the data to do this - he does it blindly

### Friend Revocation

To stop Bob from being able to access Alice's location, Alice could ask Luke to stop sending him updates - i.e. Luke remove the AliceBob re-encryption key RKab

However, if Luke and Bob collude, this may not work

To prevent this, Alice can generate a new public-private keypair using parts of the old keypair and new re-encryption keys using parts of the old re-encryption keys for her remaining location-sharing friends

### Proxy Re-encryption

Longitude's proxy re-encryption scheme is based on symmetric bilinear pairings that pair two elements from one group to an element of a second group

$G_1$ and $G_2$ are two cyclic groups of prime order $q$

$g$ is the genertor for $G_1$

The bilinear pairing $e: G_1 \times G_1 \rightarrow G_2$ has the following properties:

- Bilinearity - for all $u, v \in G_1.\ a, b \in \Z q$ we have $e(u^a,v^b)=e(u,v)^{ab}$
- Non-degeneracy - $e(g,g) \neq 1$
- Computable - There exists an efficient algorithm to compute $e(u,v)$ for all $u, v \in G_1$

The stages are:

1. Setup - Luke generates public parameters (e.g. $G1$, $G2$) where $e$ is a bilinear pairing from $G1 \times G2 \rightarrow G2$, $g$ is the generator for $G1$

2. Alice's Key Generation - Alice generates her public key $pk_a = (h_{a1}, h_{a1}, Z_a)$ and her private key $sk_a = (x_a, y_a)$ using $e$, $g$ and 3 random numbers $x_a$, $y_a$, $z_a$
3. Alice generates a re-encryption key $rk_{a\rightarrow b}$ for her friend Bob. This is generated using values from Alice ($h_{a2}^{-x_a}$) and Bob $h_{b1}$. Luke will be able to use Alice's encrypted locations plus two elements of the Alice's re-encryption key for Bob to re-encrypt the location such that Bob will be able to recover it
4. Alice updates the encrypted location - she encrypts her location $m$ using $Z_a$, $g$ and a random number $r_a$ and sends the resulting pair of values to Luke
5. Luke re-encrypts Alice's encrypted location for Bob - when Bob asks for Alice's location, Luke will re-encrypt Alice's encrypted location using both elements of Alice's encrypted location, and both elements of Alice's re-encryption key for Bob. The resulting cyphertext $c1$ and $c2$ are sent to Bob
6. Decrypt - on receipt, Bob decrypts $c1$ and $c2$ using an element $y_b$ of his private key. $y_b$ is related to $h_{b1}$ since $h_{b1} = g^{y_b}$
