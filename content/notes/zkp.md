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

A <mark>valid proof</mark> is information that leads to the <mark>acceptance of the truth of a statement</mark>

Proving systems are typically characterised by two main properties: <mark>soundness and completeness</mark>

Proving systems and protocols have a <mark>verifier</mark> which <mark>validates whether a statement is true</mark>

### Soundness

The soundness of a proving system is quantified by its <mark>effectiveness at preventing an honest verifier</mark> $v$ from being <mark>convinced of the truthfulness of false statements</mark>

The soundness error quantifies the <mark>probability of $v$ accepting false statements</mark> under a given proof system

Soundness error = $Prob(NY)$

| Result $\downarrow$ Truth $\rightarrow$ | Yes | No              |
| --------------------------------------- | --- | --------------- |
| Yes                                     | YY  | <mark>NY</mark> |
| No                                      | YN  | NN              |

### Completeness

The completeness of a proving system is quantifies by its <mark>effectiveness at enabling an honest verifier</mark> $v$ of being <mark>convinced of the truthfulness of true statements</mark>

The completeness error quantifies the <mark>probability of $v$ rejecting true statements</mark> under a given proof system

| Result $\downarrow$ Truth $\rightarrow$ | Yes             | No  |
| --------------------------------------- | --------------- | --- |
| Yes                                     | YY              | NY  |
| No                                      | <mark>YN</mark> | NN  |

Completeness error = $Prob(YN)$

## Interactive Proofs

Interactive proof systems describe a <mark>two-party protocol</mark>, where one party, the <mark>prover $P$</mark>, produces a <mark>proof that a statement is true</mark>, while interacting with the other party, the <mark>verifier $V$</mark>, which <mark>validates the proof of this statement's truth</mark>

The duration and complexity of this interaction is not set in stone, but usually takes the form of an <mark>interrogation of the prover by the verifier</mark>

So in short: a prover $P$ proves to the verifier $V$ that a statement is true

For example:

$P \rightarrow V$: I am user blabla9000

$V \rightarrow P$: Sign his birthday with his public key

$P \rightarrow V$: Sign(day, month, year)

$V \rightarrow P$: Pass

### Degenerate IP for NP Relations

A straightforward interactive proof system that enjoys perfect soundness and perfect completeness is:

Let $R \subseteq \{0,1\}^* \times \{0,1\}^*$ be a binary relation and let $L_R = \{x:\exists y$ such that $(x,y) \in R\}$ be the language defined by $R$

We say that <mark>$R$ is an NP relation</mark> (and $L_R \in $ NP) iff there <mark>exists a polynomial $p$</mark> such that <mark>for all $(x,y) \in R$</mark> it holds that <mark>$|y| < p(|x|)$</mark>, and there exists a <mark>polynomial time algorithm for deciding if $(x,y) \in R$</mark>

$y$ is called a <mark>witness for $x$</mark> iff $(x,y) \in R$

### Non-degenerate IP for Graph Non-Isomorphism

Recall the definition of graph isomorphism, where two graphs ($G_1, G_2$) with the same number of vertices an edges are isomorphic if there exists a relabelling $\varphi$ of the vertices of one graph that produces the other such that $\varphi(G_1) = G_2$

We leverage bidirectional interaction to sketch out an <mark>interactive proof system for graph non-isomorphism </mark>that allows a <mark>prover $P$ to convince a verifier $V$</mark> that <mark>two mutually known graphs are non-isomorphic</mark>:

- <mark>$V$ randomly selects one of the two graphs</mark> and <mark>sends a random isomorphic copy</mark> $H$ of that graph to $P$
- \$P\$ determines (not necessarily efficiently) <mark>which of the two mutually known graphs the isomorphic copy corresponds to</mark>, and notified $V$ of the result
- $V$ checks whether <mark>$P$'s answer is the mutually known graph</mark> that $V$ initially randomly selected (i.e. whether $P$ guessed $V$'s initial random choice correctly)

While this systems completeness error ($Prob[YN]$) will be 0, its <mark>soundness error ($Prob[NY]$) will be $\frac{1}{2}$</mark>

## Proofs of Knowledge

The term knowledge is used to refer to the <mark>results that are computationally hard to derive</mark> using public information

Proofs of Knowledge are mainly concerned with <mark>convincing a non-trivial knowledge verifier</mark> $V$ that for a given $x \in L_R$, the statement <mark>"$P$ knows \$y \in R(x)$" is true</mark>, there $R(x)\$ is the set of all witnesses for $x$

$V$ being non-trivial for $R$ implies that there exists a <mark>$P$ that will always convince $V$ of its knowledge of a witness for all $x \in L_R$</mark>

<mark>"$P$ knows ... "</mark> does <mark>not necessarily imply</mark> that the <mark>knowledge is directly available to $P$ in a simple form</mark>, but is instead defined in <mark>behavioural terms</mark>, i.e. $P$ behaves as if it has a $y \in R(x)$

### Knowledge Extraction

$P$ is considered by a non-trivial knowledge verifier $V$ to <mark>"know" a witness for $x \in L_R$</mark> iff there exists a <mark>universal knowledge extractor $E$</mark> that can <mark>use any $P$ as an oracle</mark> to <mark>successfully compute a witness</mark> $y \in R(x)$ in <mark>expected polynomial time</mark> with probability at least $\frac{p(x)}{q(|x|)}$, where $p(x)$ is the probability of $P$ convincing $V$ of its knowledge of a witness for $X$, and $q(x)$ is a positive polynomial

<mark>Knowledge Error $k(|x|)$</mark> is the probability of <mark>$P$ convincing $V$</mark>, despite <mark>$P$ not fully knowing a witness for $x$</mark>

When $k(x) > 0$, the probability of $E$ successfully extracting a witness becomes at least $\frac{p(x) - k(|x|)}{q(x)}$

### Extracting Graph Isomorphisms

Another example of an interactive proof for extracting graph isomorphisms is:

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $H = \Psi(G_2$) where $\Psi$ is a random relabel

$V \rightarrow P$: $c \in \{1,2\}$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $\omega(G_c) = H$

This system enjoys <mark>perfect completeness</mark>, and the above definition of $P$ qualifies $V$ as <mark>non-trivial</mark>

However, the <mark>soundness error here is equal to $\frac{1}{2}$</mark>

Given the $V$ above, we can <mark>define a knowledge extractor $E$</mark> that executes $P$ twice using the same randomness

In the first invocation, <mark>$E$ provides $c=2$ to $P$</mark> (receiving $\Psi$) and in the second invocation, $E$ receives $\Psi \cdot \varphi$ through <mark>proving $c=1$</mark>

<mark>$E$ very easily derives $\Psi^{-1}$</mark> and outputs <mark>$\varphi = \Psi^{-1} \cdot \Psi \cdot \varphi$ if $\varphi(G_1) = G_2$</mark>

Otherwise, <mark>$E$ reports failure</mark> to derive a witness

Without $\varphi$, $P$ may fool $V$ with probability $\frac{1}{2}$ on any valid input by correctly predicting $V$'s challenge in advance

## Zero-Knowledge Proofs of Knowledge

A Zero Knowledge Proof is intended to be <mark>equivalent to a trusted third party simply asserting the truth of a statement</mark>

The main goal of a ZKPoK system is to <mark>convince a non-trivial knowledge verifier $V$</mark> that <mark>$P$ knows a witness for $x \in L_R$</mark> but <mark>without letting $V$ gain any knowledge</mark>

A party is said to have <mark>gained knowledge</mark> when it <mark>learns the results of a computation</mark> that was <mark>infeasible for the party to perform</mark>

We do not assess the knowledge gain of $V$ only in terms pf what was leaked about the witness, but also in terms of how much knowledge was gained about anything from interacting with $P$, i.e. we quantify the robustness of $P$ against attempts to gain knowledge from interacting with it

### Zero Knowledge

The extent to which any $V$ can gain knowledge through interacting with $P$ can be demonstrated through showing that <mark>all computational results</mark> feasibly <mark>reachable by $V$</mark> after <mark>interacting with $P$</mark> on input $x \in L$ are <mark>feasibly reachable by $V$</mark> on input $x$ <mark>without interaction with $P$</mark>

More concretely, this knowledge equivalence is shown through <mark>demonstrating that for any $V$</mark>, there exists a <mark>probabilistic polynomial-time simulator</mark> $S$ which can <mark>create a set of communication transcripts</mark> $T_S = \{S_x\}, x \in L$ that is <mark>indistinguishable from the set of real communication transcripts</mark> $T_R = \{R_x\}, x \in R$ between $V$ and $P$

There are three types of zero-knowledge:

- <mark>Perfect zero-knowledge</mark>: $T_S$ is identical to $T_R$
- <mark>Statistical zero=knowledge</mark>: $T_S$ is statistically equivalent to $T_R$
- <mark>Computational zero-knowledge</mark>: No PPT algorithm can change its output when given sufficiently large members of $T_S$ as input rater than equally sized member of $T_R$ or vice versa

### Simulating Graph Isomorphism

Using the interactive proof described earlier:

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $H = \Psi(G_2$) where $\Psi$ is a random relabel

$V \rightarrow P$: $c \in \{1,2\}$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $\omega(G_c) = H$

$P$ achieves <mark>perfect zero-knowledge</mark> as <mark>protocol transcripts can be easily simulated</mark> by <mark>generating an isomorphism after $V$ has made its choice</mark>

The difficulty lies in specifying an adequate simulator which works for a $V$ that deviates from the specification

## Arguments (of Knowledge)

By relaxing soundness to account for cases where it is computationally hard to fool $V$ into accepting false statements, we can construct systems for <mark>computationally sounds proofs of knowledge</mark>, known as <mark>arguments</mark> (of knowledge)

Essentially, in this model, we <mark>only have to consider an arbitrary probabilistic polynomial-time</mark> $P$ when analysing the system

When we know that <mark>any $P$ under consideration must be efficient</mark>, we can <mark>grant the knowledge extractor</mark> $E$ <mark>access to $P$'s internal state and code</mark> without worrying that $E$ will become inefficient

This is in contract to the previous definition of $E$, which permitted only black-box oracle access to $P$

### Arguable Isomorphism

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $h = HASH(\Psi(G_2$)) where $\Psi$ is a random relabel

$V \rightarrow P$: $c \in \{1,2\}$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $HASH(\omega(G_c)) = h$

Recall that in our graph isomorphism proving system, <mark>$P$ simply provides the isomorphic copy $H$ to $V$ </mark>in a perfectly binding manner

We can instead <mark>replace this plaintext message with only a hash of $H$</mark> and <mark>require $V$ to check</mark> whether <mark>hashing the graph</mark> resulting from applying the isomorphism supplied by $P$ in response to the challenge <mark>corresponds with the hash supplied by $P$</mark>

While the soundness error remains the same, the <mark>system now only provides computational soundness,</mark> as an unbounded adversary may break the hashing scheme to reveal an isomorphic ciy of the graph $V$ chose

### Non-Interactive Arguments

Knowledge: $\varphi$ such that $\varphi(G_1) = G_2$

$P \rightarrow V$: $h = HASH(\Psi(G_2$)) where $\Psi$ is a random relabel

$P \rightarrow V$: $c = R(G_1, G_2, h)$

$P \rightarrow V$: $\omega = \Psi \cdot \varphi$ if $c=1$ otherwise $\omega = \Psi$

$V \rightarrow P$: Pass iff $HASH(\omega(G_c)) = h$

Non-interactive arguments take the form of the <mark>degenerate IP case</mark> (one unidirectional prover to verifier interaction) but with the added benefit of <mark>allowing $P$ and $V$ to access a random oracle $R$</mark>, usually realised in the form of a good cryptographic hashing function

$R$ allows $P$ to independently simulate the equivalent of a random challenge in response to $P$'s commitment, and allows $V$ to validate whether the challenge responded to by $P$ is random (derived from $R$ using the statement and $P$'s commitment)

## zkSNARKS

zkSNARKS (Zero Knowledge Succinct Non-interactive Argument of Knowledge Systems) <mark>reduce the protocol communication complexity</mark> and/or <mark>computational load</mark> placed on $V$, which enables exciting applications to be practically realised at the cost of proving time

However, the saving in communication and/or verification costs do not come free - they're <mark>paid for by the prover</mark>, who has to perform potentially more complex computations to yield a valid argument

### Succinctness

A computationally sound non-interactive knowledge proving system is <mark>succinct</mark> if it <mark>enables verifying NP statements </mark>with <mark>complexity independent</mark> from <mark>deciding membership in the target NP language</mark> (it can efficiently decide if $x \in L_R$)

### Setup

These systems can be built in the <mark>common reference string (CRS) model</mark>, where $P$ and $V$ both have access to a string sampled from a uniform distribution

Consequently, CRS generation becomes an important step in zkSNARKS

There are many trade-offs in terms of proving costs and/or verification costs between systems with different setup features and requirements

Full succinctness is when the length of the CRS is reasonably short (a few hundred bytes)

Their <mark>transparency</mark> can either be <mark>Trusted</mark> (the parties which perform the setup are entrusted to forget sensitive info learned when communication with CRS) or <mark>Public</mark> (no privileged information is learned when constructing the string)

The <mark>application</mark> can either be <mark>Specific</mark> (a new CRS is needed for each application) or <mark>Universal</mark> (there is one universal CRS for all relations, or all R are of similar complexity)
