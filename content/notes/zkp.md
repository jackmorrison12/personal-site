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

The term knowledge is used to refer to the results that are computationally hard to derive using public information

Proofs of Knowledge are mainly concerned with convincing a non-trivial knowledge verifier $V$ that for a given $x \in L_R$, the statement "$P$ knows \$y \in R(x)$" is true, there $R(x)\$ is the set of all witnesses for $x$

$V$ being non-trivial for $R$ implies that there exists a $P$ that will always convince $V$ of its knowledge of a witness for all $x \in L_R$

:$P$ knows ... " does not necessarily imply that the knowledge is directly available to $P$ in a simple form, but is instead defined in behavioural terms, i.e. $P$ behaves as if it has a $y \in R(x)$

### Knowledge Extraction

$P$ is considered by a non-trivial knowledge verifier $V$ to "know" a witness for $x \in L_R$ iff there exists a universal knowledge extractor $E$ that can use any $P$ as an oracle to successfully compute a witness $y \in R(x)$ in expected polynomial time with probability at least $\frac{p(x)}{q(|x|)}$, where $p(x)$ is the probability of $P$ convincing $V$ of its knowledge of a witness for $X$, and $q(x)$ is a positive polynomial

Knowledge Error $k(|x|)$ is the probability of $P$ convincing $V$, despite $P$ not fully knowing a witness for $X$

When $k(x) > 0$, the probability of $E$ successfully extracting a witness becomes at least $\frac{p(x) - k(|x|)}{q(x)}$

### Extracting Graph Isomorphisms

Another example of an interactive proof for extracting graph isomorphisms is:

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $H = \Psi(G_2$) where $\Psi$ is a random relabel

$V \rightarrow P$: $c \in \{1,2\}$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $\omega(G_c) = H$

This system enjoys perfect completeness, and the above definition of $P$ qualifies $V$ as non-trivial

However, the soundness error here is equal to $\frac{1}{2}$

Given the $V$ above, we can define a knowledge extractor $E$ that executes $P$ twice using the same randomness

In the first invocation, $E$ provides $c=2$ to $P$ (receiving $\Psi$) and in the second invocation, $E$ receives $\Psi \cdot \varphi$ through proviginf $c=1$

$E$ very easily derives $\Psi^{-1}$ and outputs $\varphi = \Psi^{-1} \cdot \Psi \cdot \varphi$ if $\varphi(G_1) = G_2$

Otherwise, $E$ reports failure to derive a witness

Without $\varphi$, $P$ may fool $V$ with probability $\frac{1}{2}$ on any valid input by correctly predicting $V$'s challenge in advance

## Zero-Knowledge Proofs of Knowledge

A Zero Knowledge Proof is intended to be equivalent to a trusted third party simply asserting the truth of a statement

The main goal of a ZKPoK system is to convince a non-trivial knowledge verifier $V$ that $P$ knows a witness fot $x \in L_R$ but without letting $V$ fain any knowledge

A party is said to have gained knowledge when it learns the results of a computation that was infeasible for the party to perform

We do not assess the knowledge gain of $V$ only in terms pf what was leaked about the witness, but also in terms of how much knowledge was gained about anything from interacting with $P$, i.e. we quantify the robustness of $P$ against attempts to gain knowledge from interacting with it

### Zero Knowledge

The extent to which any $V$ can gain knowledge through interacting with $P$ can be demonstrated through showing that all computational results feasibly reachable by $V$ after interacting with $P$ on input $x \in L$ are feasibly reachable by $V$ on input $x$ without interaction with $P$

More concretely, this knowledge equivalence is shown through demonstrating that for any $V$, there exists a probabilistic polynomial-time simulator $S$ which can create a set of communication transcripts $T_S = \{S_x\}, x \in L$ that is indistinguishable from the set of real communication transcripts $T_R = \{R_x\}, x \in R$ between $V$ and $P$

There are three types of zero-knowledge:

- Perfect zero-knowledge: $T_S$ is identical to $T_R$
- Statistical zero=knowledge: $T_S$ is statistically equivalent to $T_R$
- Computational zero-knowledge: No PPT algorithm can change its output when given sufficiently large members of $T_S$ as input rater than equally sized member of $T_R$ or vice versa

### Simulating Graph Isomorphism

Using the interactive proof decribed earlier:

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $H = \Psi(G_2$) where $\Psi$ is a random relabel

$V \rightarrow P$: $c \in \{1,2\}$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $\omega(G_c) = H$

$P$ achieves perfect zero-knowledge as protocol transcripts can be easily simulated by generating an isomorphism after $V$ has made its choice

The difficulty lies in specifying an adequate simulator which works for a $V$ that deviates from the specification

## Arguments (of Knowledge)

By relaxing soundness to account for cases where it is computationally hard to fool $V$ into accepting false statements, we can construct systems for computationally sounds proofs of knowledge, known as arguments (ok knowledge)

Essentially, in this model, we only have to consider an arbitrary probabilistic polynomial-time $P$ when analysing the system

When we know that any $P$ under consideration must be efficient, we can grant the knowledge extractor $E$ access to $P$'s internal state and code without worrying that $E$ will become inefficient

This is in contract to the previous definition of $E$, which permitted only black-box oracle access to $P$

### Arguable Isomorphism

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $h = HASH(\Psi(G_2$)) where $\Psi$ is a random relabel

$V \rightarrow P$: $c \in \{1,2\}$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $HASH(\omega(G_c)) = h$

Recall that in our graph isomorphism proving system, $P$ simply provides the isomorphic copy $H$ to $V$ in a perfectly binding manner

We can instead replace this plaintext message with only a hash of $H$ and require $V$ to check whether hashing the graph resulting from applying the isomorphism supplied by $P$ in response to the challenge corresponds with the hash supplied by $P$

While the soundness error remains the same, the system now only provides computational soundness, as an unbounded adversary may break the hashing scheme to reveal an isomorphic ciy of the graph $V$ chose

### Non-Interactive Arguments

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $h = HASH(\Psi(G_2$)) where $\Psi$ is a random relabel

$P \rightarrow V$: $c = R(G_1, G_2, h)$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $HASH(\omega(G_c)) = h$

Non-interactive arguments take the form of the degenerate IP case (one unidirectional prover to verifier interaction) but with the added benefit of allowing $P$ and $V$ to access a random oracle $R$, usually realised in the form of a good cryptographic hashing function

$R$ allows $P$ to independently simulate the equivalent of a random challenge in response to $P$'s commitment, and allows $V$ to validate whether the challenge responded to by $P$ is random (derived from $R$ using the statement and $P$'s commitment)

## zkSNARKS

zkSNARKS (Zero Knowledge Succinct Non-interactive Argument of Knowledge Systems) reduce the protocol communication complexity and or computational load places on $V$, which enables exciting applications to be practically realised at the cost of proving time

However, the saving in communication and or verification costs do not come free - they're paid for by the prover, who has to perform potentially more complex computations to yield a valid argument

### Succinctness

A computationally sound non-interactive knowledge proving system is succinct if it enables verifying NP statements with complexity independent from deciding membership in the target NP language (it can efficiently decide if $x \in L_R$)

### Setup

These systems can be built in the common reference string (CRS) model, where $P$ and $V$ both have access to a string sampled from a uniform distribution

Consequently, CRD generation becomes an important step in zkSNARKS

There are many trade-offs in terms of proving costs and/or verification costs between systems with different setup features and requirements

Full succinctness is when the length of the CRS is reasonably short (a few hundred bytes)

Their transparency can either be Trusted (the parties which perform the setup are entrusted to forget sensitive info learned when communication with CRS) or Public (no privileged information is learned when constructing the string)

The application can either be Specific (a new CRS is needed for each application) or Universal (there is one universal CRS for all relations, or all R are of similar complexity)
