---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: ZCash
slug: zcash
topic: 8.2
hidden: false
tags:
  - ZCash
---

## Transparent Pool Payments

Transparent payemnts in ZCash work the same way as Bitcoin payments - they're both executed within an unspent transaction output (UTXO) ledger that provides no privacy

A UTXO ledger is a record of transations, each of which spends the total value contained in all inputs it references to create new outputs with specific values

A transaction output specifies under what conditions the coins allocated to it can be spent (i.e. who can spend it)

If the sum of coins in the outputs of a transaction is less than the sum of the coins in its inputs, the remainder is considered a transaction fee

### Linkability

Inputs, outputs and amounts are specified in plaintext, which enables the construction of a directed acyclic graph that represents the flow of currency between addresses

While in the early days, several media outlets claimed Bitcoin to be an an anonymous payment system, several works later demonstrated that a lot of information about the users behind the pseudo-anonymous payments can be inferred

The inference is mainly enables by the linkability of transparent transactions, which permits analysts to piece together how senders and recipients are connected in real life, given only partial information about address owners in real life

## Shielded Pool Payments

Shielded transaction in ZCash leverages zkSNARKS to allow the validation of transactions without revealing addresses or values

Each transaction bears a zkSNARK (in lieu of a signature) that argues in zero-knowledge that:

- All inputs are unspent
- The prover controls all inputs (knows their private key)
- the total value of created outputs does not eceed that of inputs

$V$ must receive enough information about the transaction is it currently validating to update the ledger such that $V$ is able to validate future transactions

### Linkability

Shielded transactions support a padded memo field, which a sender may user to append arbitrary, potentially identifying data to a transaction

Recipients can always learn when they have received a payment, and can learn the value of the payment and its memo, but can not learn information about the input(s) used to create the transaction, or information about outputs created for other recipients

Ultimately, to learn any useful information about purely shielded payments, either the sender or the recipient must disclose the knowledge available to it

Senders and recipients can voluntarily disclose some information about a transaction to third parties using viewing keys

## Cross-Pool Payments

Also known as bridging payments, this is where potential anonymity leaks begin

Shielding transactions (t-to-z) transfer coins from the transparent pool to the shielded pool by spending transparent inputs and creating shielded outputs

Unshielding transactions (z-to-t) do the opposite

Evidently, one can attempt to connect shielding transactions with unshielding transactions, but while losing the information related to any purely shielded transactions that happen between

### Linkability

Heuristics are uses to link cross-pool payments, for example:

- If two or more t-addresses are inputs in the same transaction, they're controlled by the same entity
- If one or more addresses are input t-addresses in a vJoinSplit transaction, and another address is an output t-address in the same vJoinSplit transaction, then if the size of zOut is 1, the second address belongs to the same user who controls the input addresses
