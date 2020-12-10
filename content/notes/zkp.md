---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Zero-Knowledge Proofs
slug: zkp
topic: 8.1
hidden: false
tags:
  - Zero-Knowledge Proofs
---

## Proving Systems

A valid proof is information that leads to the acceptance of the truth of a statement

Proving systems are typically characterised by two main properties: soundness and completeness

Proving systems and protocols have a verifier which validates whether a statement is true

### Soundness

The soundness of a proving system is quantified by its effectiveness at preventing an honest verifier $v$ from being convinced of the truthfulness of false statements

The soundness error quantifies the probability of $v$ accepting false statements under a given proof system

Soundness error = $Prob(NY)$

| Result $\downarrow$ Truth $\rightarrow$ | Yes | No              |
| --------------------------------------- | --- | --------------- |
| Yes                                     | YY  | <mark>NY</mark> |
| No                                      | YN  | NN              |

### Completeness

The completeness of a proving system is quantifies by its effectiveness at enabling an honest verifier $v$ of being convinces of the truthfulness of true statements

The completeness error quantifies the probability of $v$ rejecting true statements under a given proof system

| Result $\downarrow$ Truth $\rightarrow$ | Yes             | No  |
| --------------------------------------- | --------------- | --- |
| Yes                                     | YY              | NY  |
| No                                      | <mark>YN</mark> | NN  |

Completeness error = $Prob(YN)$

## Interactive Proofs

Interactive proof systems describe a two-party protocol, where one party, the prove $P$, produces a proof that a statement is true, while interacting with the other party, the verifier $V$, which validates the proof of this statement's truth

The duration and complexity of this interaction is not set in stone, but usually takes the form of an interrogation of the prover by the verifier

So in short: a prover $P$ proves to the verifier $V$ that a statement is true

For example:

$P \rightarrow V$: I am user blabla9000

$V \rightarrow P$: Sign his birthday with his public key

$P \rightarrow V$: Sign(day, month, year)

$V \rightarrow P$: Pass

### Degenerate IP for NP Relations

A straightforward interactive proof system that enjoys perfect soundness and perfect completeness is:

Let $R \subseteq \{0,1\}^* \times \{0,1\}^*$ be a binary relation and let $L_R = \{x:\exists y$ such that $(x,y) \in R\}$ be the language defined by $R$

We say that $R$ is an NP relation (and $L_R \in $ NP) iff there exists a polynomial $p$ such that for all $(x,y) \in R$ it holds that $|y| < p(|x|)$, and there exists a polynomial time algorithm for deciding if $(x,y) \in R$

$y$ is called a witness for $x$ iff $(x,y) \in R$

### Non-degenerate IP for Graph Non-Isomorphism

Recall the definition of graph isomorphism, where two graphs ($G_1, G_2$) with the same number of vertices an edges are isomorphic if there exists a relabelling $\varphi$ of the verticies of one graph that produces the other such that $\varphi(G_1) = G_2$

We leverage bidirectional interaction to sketch out an interactive proof system for graph non-isomorphism that allows a prover $P$ to convince a verifier $V$ that two mutually known graphs are non-isomorphic:

- $V$ randomly selects one of the two graphs and sends a random isomorphic copy $H$ of that graph to $P$
- \$P\$ determines (not necessarily efficiently) which of the two mutually known graphs the isomorphic copy corresponds to, and notified $V$ of the result
- $V$ checks whether $P$'s answer is the mutually known graph that $V$ initially randomly selected (i.e. whether $P$ guessed $V$'s initial random choice correctly)

While this systems completeness error ($Prob[YN]$) will be 0, its soundness error ($Prob[NY]$) will be $\frac{1}{2}$

## Proofs of Knowledge

## Zero-Knowledge Proofs of Knowledge

## Arguments (of Knowledge)

## zkSNARKS
