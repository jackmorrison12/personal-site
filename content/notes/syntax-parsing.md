---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Syntax & Parsing
slug: syntax-parsing
topic: 9
hidden: false
tags:
  - Syntax & Parsing
---

## Statistical Parsing

Given a sequence of words (usually a sentence), we want to <mark>generate its syntactic structure</mark>

There are two main types:

- <mark>Constituency Parsing</mark> (tree based)
- <mark>Dependency Parsing</mark> (graph based)

## Constituency Parsing

There are many application, such as:

- <mark>Grammar Checking</mark>
- <mark>Semantic Analysi</mark>
  - Question answering
  - Named entity recognition
- <mark>Machine translation</mark>

It's harder than POS tagging however, since:

- One label per group of words
- Structural plus POS ambiguity

Classical parsing takes a <mark>grammar</mark> and a <mark>lexicon</mark>, as well as a <mark>new sentence</mark>, and from this generates the <mark>structure of the sentence</mark>

It's based on the idea of phrase structure - words are grouped into <mark>constituents</mark>

A constituent is a <mark>sequence of words that behaves as a unit</mark>, generally a phrase

A test to see whether something is a unit is whether you can <mark>move it around</mark>, e.g.:

- John talked \[to the children] \[about drugs].
- John talked \[about drugs] \[to the children].

Phrase structure grammars are <mark>context-free grammars</mark> $G=(T,N,S,R)$, where

- $T$ is the set of <mark>terminals</mark>
- $N$ is the set of <mark>nonterminals</mark>
- $S$ is the start <mark>symbol</mark>
- $R$ is the set of <mark>rules</mark> $A \rightarrow \gamma$, where $X$ is a nonterminal and $\gamma$ is a sequence of terminals & nonterminals

A grammar G generates a language L, or L is recognised by G

To do this automatically, we can either:

- Use <mark>proof systems</mark> to prove parse trees from words
- Make it a <mark>search problem</mark>: all possible parse trees for a string
  - Bottom up (words to grammar)
  - Top down (grammar to words)

### <mark>CKY</mark> Algorithm

The CKY algorithm is a <mark>DP algorithm</mark> which tests for possibilities to split the current sequence into two smaller sequences

It assumes grammar is in <mark>Chomsky Normal Form</mark> (CNF):

- Rules are of the form $x \rightarrow YZ$ or $X \rightarrow w$
- <mark>Deterministic rules</mark> to convert any CFG into CNF with <mark>no loss of information</mark>
- $VP \rightarrow V\ NP\ PP$ becomes $VP \rightarrow V\ NEW; NEW \rightarrow NP\ PP$
- $INF-VP \rightarrow to\ VP$ becomes $INF-VP \rightarrow TO\ VP$ and $TO \rightarrow to$

<mark>Binarisation</mark> makes CKY ver efficient - it runs in <mark>O(n$^3$|G|)</mark>, where n is the length of the parsed string and |G| is the size of the CNF grammar G - otherwise, it would be exponential

<mark>Dynamic programming</mark> algorithm efficiently generates all possible parse trees bottom up

It uses a 2D matrix nxn, where n is the length of the sentence, to encode the possible parses

It uses the <mark>upper-triangular portion</mark> of the symmetric matrix

Each cell\[i,j] in matrix contains the set of non-terminals that represent all the constituents that span positions i-j of the input

The call that represents the entire input resides in position \[1,n] of the matrix

An example can be seen [here](https://www.youtube.com/watch?v=b98Uyj7JHIU&ab_channel=AndyP.)

This shows CKY for recognition, however to use it for parsing, we also need to:

1. <mark>Add backpointers</mark>: augment entries in matrix such that each non-terminal is paired with pointers to the matrix entries from which is was derived
2. Allow <mark>multiple versions</mark> of the <mark>same non-terminal</mark> to be entered into the matrix

Choose S from cell \[0,n] and recursively retrieve its component constituents from the matrix

## <mark>Statistical Parsing</mark>

<mark>CKY does not scale</mark> - there are <mark>too many parse trees</mark> for a comprehensive grammar

Therefore, the solution is statistical parsing:

- Find the <mark>most likely parse(s)</mark> via statistical parsing
- Comprehensive grammars admit millions of parses for a sentence, but we can still quickly find the best parse

We learn the probabilistic grammars from labelled data called <mark>treebanks</mark>

Treebanks are <mark>expensive to build</mark>, but:

- Can be <mark>reused</mark> for different parsing approaches
- Can cover <mark>diverse cases</mark>
- <mark>Frequencies and distributional information</mark> are required
- Provide a way to <mark>evaluate parses</mark>

To learn a grammar from a treebank, we:

- Take <mark>annotated trees</mark>
- <mark>List all rules</mark> used
- <mark>Assign probabilities</mark> (MLE) to all rules by counting ($c$):
  - $q(X \rightarrow \gamma) = \frac{c(X \rightarrow \gamma)}{c(X)}$

Therefore, the probabilistic/stochastic phrase structure grammar is a <mark>context-free grammar $PCFG = (T,N,S,R,q)$</mark>, where:

- $T$ is the set of terminals
- $N$ is the set of nonterminals
- $S$ is the start symbol
- $R$ is the set of rules $A \rightarrow \gamma$, where $X$ is a nonterminal and $\gamma$ is a sequence of terminals & nonterminals
- $q = P(R)$ gives the <mark>probability of each rule</mark>
  - $X \in N, \sum_{X \rightarrow \gamma \in R}P(X \rightarrow \gamma) = 1$

The probability of a given tree $t$ is:

<mark>$P(t) = \prod_{i=1}^n q(X_i \rightarrow \gamma_i)$</mark>

Where <mark>$q(X \rightarrow \gamma)$</mark> is the <mark>probability of the rule</mark> $X \rightarrow \gamma$

In simpler terms: the probabilities of the trees is obtained by <mark>multiplying the probabilities of each of the rules used in the derivation</mark>, which works as a disambiguation method

However, the brute-force approach of enumerating all options <mark>doesn't scale...</mark>

Given all the possible parse trees $\tau$ for a given sentence $s$, the string of words $s$ is called the yield of any parse tree over $s$

Out of all parse trees that yield $s$, the algorithm picks the parse tree $t$ that is most probable given $s$ ($t \in \tau(s)$): $\hat{t}(s) = arg\max\limits_{t \in \tau(s)}P(t|s)$

By definition $P(t|s) = \frac{P(t,s)}{P(s)}$

Since $P(s)$ is a constant and $P(t,s) = P(t)$ since a parse tree includes all words in the sentence, $P(s|t) = 1$, i.e. $P(t,s) = P(t)P(s|t) = P(t)$

Thus $\hat{t}(s) = arg\max\limits_{t \in \tau(s)}P(t|s)$

### <mark>CYK algorithm for PCFG</mark>

The same DP algorithm can now be used to find the most likely parse tree

This is useful for:

- <mark>Recognition</mark> (does this sentence belong in the language?)
- <mark>Parsing</mark> (give me a possible derivation)
- <mark>Disambiguation</mark> (give me the best derivation)

This all happens in <mark>polynomial time</mark>

The grammar needs to be in <mark>CNF</mark>, as before - this requires us to modify the probabilities so that the probability of each parse remains the same under new CNF grammar, e.g.:

$VP \rightarrow Vt\ NP\ PP (0.2)$ becomes $VP \rightarrow New\ PP (0.2); New \rightarrow Vt\ NP (1.0)$

We then build the matrix as with CKY before, and often unary rules are included

This is a <mark>hierarchical process:</mark>

- $n$ is the number of words in a sentence
- $w_{1\ n} = w_1 ... w_n$ = the word sequence from $1$ to $n$
- $w_{i\ j}$ = the subsequence $w_i ... w_j$
- $X_{i\ j}$ = the nonterminal $X$ dominating $w_i...w_j$

Define the dynamic table $\pi[i,j,X]$ = maximum probability of a constituent with a non-terminal $X$ panning words $i...j$ incusive

With the goal to calculate $\max\limits_{t \in \tau(s)}p(t) = \pi[1,n,S]$

The algorithm is therefore:

- <mark>Base case</mark> (terminals):
  - for all $i = 1...n, X \in N$:
  - $\pi[i,i,X] = q(X \rightarrow w_i)$
  - where $q(X \rightarrow w_i) = 0$ if $X \rightarrow w_i$ is not in the grammar
- <mark>Recursive case:</mark>
  - for all $i = 1...n-1, j = (i + 1)...n, X \in N$
  - $\pi[i,j,X] = \max\limits_{X\rightarrow YZ \in R, s \in \{i...(j-1)\}} (q(X \rightarrow YZ) \times \pi[i,s,Y] \times \pi[s+1,j,Z])$

## Dependency Parsing

This is where you <mark>connect words in a sentence</mark> to indicate <mark>dependencies between them</mark>

It's built around the notion of having <mark>heads and dependents</mark>

Arrows can be annotated by different types of dependencies:

- Head, also called argument: origin
- Dependent, also called modifier: destiny

<mark>Arrows</mark> go from a <mark>head to a dependent</mark>

There are versions with and without typed dependencies

Typed version has more reach but requires more annotation to build parses

They can also be <mark>represented in tree form</mark>

The main <mark>differences</mark> are:

- <mark>No nodes corresponding to phrasal constituents</mark> or lexical categories
- The internal structure consists only of <mark>directed relations between pairs of lexical terms</mark>
- These relationships allow <mark>directly encoding important information</mark>, e.g. the arguments to the verb prefer are directly liked to it in the dependency structure

The main <mark>advantages</mark> are:

- Ability to deal with languages that are morphologically rich and may have a relatively <mark>free word order</mark>
- PSG would have to represent <mark>two rules</mark> for <mark>each possible place of the adverb</mark>
- Dependency approach: only one link; abstracts away the word order
- Head-dependent relations provide approximation to semantic relationship between predicated and arguments
- Can be <mark>directly used to solve problems</mark> such as co-reference resolution, question answering etc.

Mappings:

Lexicalised phrase structure parse $\rightarrow$ dependency parse - follow the heads

Dependency parse $\rightarrow$ phrase structure - can do, but dependents are flat

A dependency structure is a <mark>directed graph</mark> \$G = (V,A), where:

- $V$ = set of vertices (words, punctuation, ROOT)
- $A$ = set of ordered pairs of vertices (arcs)

A dependency tree (directed graph) has to:

- A <mark>single ROOT</mark> node that has no incoming arcs
- Each vertex has exactly <mark>one incoming arc</mark> (except ROOT)
- There's a <mark>unique path from ROOT to each vertex</mark>
- There are <mark>no cycles</mark>

This ensures:

- Dependency structure becomes a <mark>tree</mark>
- Each word has a <mark>single head</mark>
- The dependency tree is <mark>connected</mark>
- There is a <mark>single ROOT</mark> from which a unique directed path follows to each word in sentence

There are multiple approaches to dependency parsing:

- <mark>Dynamic programming</mark> (cubic time, not very accurate)
- <mark>Shift-reduce</mark> (transition based)
  - Predict from left-to-right
  - Fast (linear), but slightly less accurate
  - MALT parser
- <mark>Spanning tree</mark> (graph-based, constraint satisfaction)
  - Calculate full tree at once
  - Slightly more accurate, slower
  - MST parser

### Transition-based

This is <mark>deterministic parsing</mark>

Greedy choice of attachment for each word in order, <mark>guided by ML classifier</mark>

It works very well, and has linear time parsing

- <mark>Reads sentence</mark> word by word, left to right
- Greedy decision as to <mark>how to attach each word as it is read</mark>
- Sequence of actions bottom up
- Formally, <mark>3 data structures:</mark>
  - $\sigma$ = stack, which starts with ROOT
  - $\beta$ = buffer, which starts with all words in sentence
  - $A$ = set of arcs, which starts empty
- Set of actions:
  - <mark>Shift / left arc / right arc</mark>
  - Optionally, set of dependency labels for left and right arc actions

We make the shift/reduce right/reduce left decision using an <mark>ML classifier</mark>

Each action is predicted by a <mark>discriminative classifier</mark> over each move

For <mark>untyped</mark> dependencies, <mark>3 classes shift</mark>: left or right

For <mark>typed</mark> dependencies, <mark>2 \* categories + 1 classes</mark>

Features: top of stack word, it's POS, first in buffer word, it's POS, etc.

## Neural Parsing

Parsing as <mark>translation</mark>

- Linearise grammar from treebank - convert tree to bracketed representation, all in one line
- Extract sentences from bracketed representation
- Pair sentences and their linearised trees
- No need to compute/represent probabilities - learning

Train <mark>sequence-to-sequence model</mark> to translate from:

- Sentences to linearised tree: brackets are tokens!
- Use e.g. LSTM
- Attention helps
- Train with cross-entropy
- Evaluate as a translation (BLEU) or parsing task (parseval)

There are some more advanced approaches, such as:

- <mark>Graph-based methods</mark>
- <mark>Hierarchical</mark> sequence-to-sequence models
- <mark>Transformer-based</mark>