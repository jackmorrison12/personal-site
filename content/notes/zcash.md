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

Transparent payments in ZCash work the same way as Bitcoin payments - they're both <mark>executed within an unspent transaction output</mark> (UTXO) ledger that provides <mark>no privacy</mark>

A UTXO ledger is a <mark>record of transations</mark>, each of which spends the total value contained in all inputs it references to create new outputs with specific values

A <mark>transaction output specifies</mark> under <mark>what conditions</mark> the <mark>coins allocated to it can be spent</mark> (i.e. who can spend it)

If the <mark>sum of coins in the outputs</mark> of a transaction is <mark>less than the sum of the coins in its inputs</mark>, the remainder is considered a <mark>transaction fee</mark>

### Linkability

<mark>Inputs, outputs and amounts</mark> are specified in <mark>plaintext</mark>, which enables the construction of a <mark>directed acyclic graph</mark> that represents the <mark>flow of currency</mark> between addresses

While in the early days, several media outlets claimed Bitcoin to be an an anonymous payment system, several works later demonstrated that a lot of information about the <mark>users behind the pseudo-anonymous payments can be inferred</mark>

The inference is mainly enabled by the linkability of transparent transactions, which permits <mark>analysts to piece together how senders and recipients are connected in real life</mark>, given only partial information about address owners in real life

## Shielded Pool Payments

Shielded transaction in ZCash leverages zkSNARKS to allow the validation of transactions without revealing addresses or values

Each transaction bears a zkSNARK (in lieu of a signature) that argues in zero-knowledge that:

- All <mark>inputs are unspent</mark>
- The <mark>prover controls all inputs</mark> (knows their private key)
- The <mark>total value of created outputs</mark> does <mark>not exceed that of inputs</mark>

$V$ must receive enough information about the transaction is it currently validating to update the ledger such that $V$ is able to validate future transactions

### Linkability

Shielded transactions support a <mark>padded memo field</mark>, which a sender may user to <mark>append arbitrary, potentially identifying data to a transaction</mark>

<mark>Recipients</mark> can always <mark>learn</mark> <mark>when</mark> they have received a payment, and can learn the <mark>value</mark> of the payment and its <mark>memo</mark>, but can <mark>not learn</mark> information about the <mark>input(s)</mark> used to create the transaction, or information about <mark>outputs</mark> created for other recipients

Ultimately, to learn any useful information about purely shielded payments, either the sender or the recipient must disclose the knowledge available to it

Senders and recipients can voluntarily disclose some information about a transaction to third parties using viewing keys

## Cross-Pool Payments

Also known as bridging payments, this is where <mark>potential anonymity leaks begin</mark>

<mark>Shielding transactions</mark> (t-to-z) transfer coins from the <mark>transparent pool to the shielded pool</mark> by spending transparent inputs and creating shielded outputs

<mark>Unshielding transactions</mark> (z-to-t) do the opposite

Evidently, one can attempt to <mark>connect shielding transactions with unshielding transactions</mark>, but while losing the information related to any purely shielded transactions that happen between

### Linkability

<mark>Heuristics</mark> are uses to link cross-pool payments, for example:

- If two or more t-addresses are inputs in the same transaction, they're controlled by the same entity
- If one or more addresses are input t-addresses in a vJoinSplit transaction, and another address is an output t-address in the same vJoinSplit transaction, then if the size of zOut is 1, the second address belongs to the same user who controls the input addresses
