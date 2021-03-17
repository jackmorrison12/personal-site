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

Given a sequence of words (usually a sentence), we want to generate its syntactic structure

There are two main types:

- Constituency Parsing (tree based)
- Dependency Parsing (graph based)

## Constituency Parsing

There are many application, such as:

- Grammar Checking
- Semantic Analysis
  - Question answering
  - Named entity recognition
- Machine translation

It's harder than POS tagging however, since:

- One label per group of words
- Structural plus POS ambiguity

Classical parsing takes a grammar and a lexicon, as well as a new sentence, and from this generates the structure of the sentence

It's based on the idea of phrase structure - words are grouped into constituents

A constituent is a sequence of words that behaves as a unit, generally a phrase

A test to see whether something is a unit is hether you can move it around, e.g.:

- John talked \[to the children] \[about drugs].
- John talked \[about drugs] \[to the children].

Phrase structure grammars are context-free grammars $G=(T,N,S,R)$, where

- $T$ is the set of terminals
- $N$ is the set of nonterminals
- $S$ is the start symbol
- $R$ is the set of rules $A \rightarrow \gamma$, where $X$ is a nonterminal and $\gamma$ is a sequence of terminals & nonterminals

A grammar G generates a language L, or L is recognised by G

To do this automatically, we can either:

- Use proof systems to prove parse trees from words
- Make it a search problem: all possible parse trees for a string
  - Bottom up (words to grammar)
  - Top down (grammar to words)

### CKY Algorithm

The CKY algorithm is a DP algorithm which tests for possibilities to split the current sequence into stwo smaller sequences

It assumes grammar is in Chomsky Normal Form (CNF):

- Rules are of the form $x \rightarrow YZ$ or $X \rightarrow w$
- Deterministic rules to convert any CFG into CNF with no loss of information
- $VP \rightarrow V\ NP\ PP$ becomes $VP \rightarrow V\ NEW; NEW \rightarrow NP\ PP$
- $INF-VP \rightarrow to\ VP$ becomes $INF-VP \rightarrow TO\ VP$ and $TO \rightarrow to$

Binarisation makes CKY ver efficient - it runs in O(n$^3$|G|), where n is the length of the parsed string and |G| is the size of the CNF grammar G - otherwise, it would be exponential

Dynamic programming algorithm efficiently generates all possible parse trees bottom up

It uses a 2D matrix nxn, where n is the length of the sentence, to encode the possible parses

It uses the upper-triangular portion of the symmetric matrix

Each cell\[i,j] in matrix contains the set of non-terminals that represent all the constituents that span positions i-j of the input

The call that represents the entire input resides in position \[1,n] of the matrix

An example can be seen [here](https://www.youtube.com/watch?v=b98Uyj7JHIU&ab_channel=AndyP.)

This shows CKY for recognition, however to use it for parsing, we also need to:

1. Add backpointers: augment entries in matrix such that each non-terminal is paired with pointers to the matrix entries from which is was derived
2. Allow multiple cersions of the same non-terminal to be entered into the matrix

Choose S from cell \[0,n] and recursively retrieve its component constituents from the matrix

## Statistical Parsing

CKY does not scale - there are too many parse trees for a comprehensive grammar

Therefore, the solution is statistical parsing:

- Find the most likely parse(s) via statistical parsing
- Comprehensive grammars admit millions of parses for a sentence, but we can still quickly find the best parse

We learn the probabilistic grammars from labelled data called treebanks

Treebanks are expensive to build, but:

- Can be reused for different parsing approaches
- Can cover diverse cases
- Frequencies and distributional information are required
- Provide a way to evaluate parses

To learn a grammar from a treebank, we:

- Take annotated trees
- List all rules used
- Assign probabilities (MLE) to all rules by counting ($c$):
  - $q(X \rightarrow \gamma) = \frac{c(X \rightarrow \gamma)}{c(X)}$

Therefore, the probabilistic/stochastic phrase structure grammar is a context-free grammar $PCFG = (T,N,S,R,q)$, where:

- $T$ is the set of terminals
- $N$ is the set of nonterminals
- $S$ is the start symbol
- $R$ is the set of rules $A \rightarrow \gamma$, where $X$ is a nonterminal and $\gamma$ is a sequence of terminals & nonterminals
- $q = P(R)$ gives the probability of each rule
  - $X \in N, \sum_{X \rightarrow \gamma \in R}P(X \rightarrow \gamma) = 1$

The probability of a given tree $t$ is:

$P(t) = \prod_{i=1}^n q(X_i \rightarrow \gamma_i)$

Where $q(X \rightarrow \gamma)$ is the probability of the rule $X \rightarrow \gamma$

In simpler terms: the probabilities of the trees is obtained by multiplying the probabilities of each of the rules used in the derivation, which works as a disambiguation method

However, the brute-force approach of enumerating all options doesn't scale...

Given all the possible parse trees $\tau$ for a given sentence $s$, the string of words $s$ is called the yield of any parse tree over $s$

Out of all parse trees that yield $s$, the algorithm picks the parse tree $t$ that is most probable given $s$ ($t \in \tau(s)$): $\hat{t}(s) = arg\max\limits_{t \in \tau(s)}P(t|s)$

By definition $P(t|s) = \frac{P(t,s)}{P(s)}$

Since $P(s)$ is a constant and $P(t,s) = P(t)$ since a parse tree includes all words in the sentence, $P(s|t) = 1$, i.e. $P(t,s) = P(t)P(s|t) = P(t)$

Thus $\hat{t}(s) = arg\max\limits_{t \in \tau(s)}P(t|s)$

### CYK algorithm for PCFG

The same DP algorithm can now be used to find the most likely parse tree

This is useful for:

- Recognition (does this sentence belong in the language?)
- Parsing (give me a possible derivation)
- Disambiguation (give me the best derivation)

This all happens in polynomial time

The grammar needs to be in CNF, as before - this requires us to modify the probabilities so that the probability of each parse remains the same under new CNF grammar, e.g.:

$VP \rightarrow Vt\ NP\ PP (0.2)$ becomes $VP \rightarrow New\ PP (0.2); New \rightarrow Vt\ NP (1.0)$

We then build the matrix as with CKY before, and often unary rules are included

This is a hierarchical process:

- $n$ is the number of words in a sentence
- $w_{1\ n} = w_1 ... w_n$ = the word sequence from $1$ to $n$
- $w_{i\ j}$ = the subsequence $w_i ... w_j$
- $X_{i\ j}$ = the nonterminal $X$ dominating $w_i...w_j$

Define the dynamic table $\pi[i,j,X]$ = maximum probability of a constituent with a non-terminal $X$ panning words $i...j$ incusive

With the goal to calculate $\max\limits_{t \in \tau(s)}p(t) = \pi[1,n,S]$

The algorithm is therefore:

- Base case (terminals):
  - for all $i = 1...n, X \in N$:
  - $\pi[i,i,X] = q(X \rightarrow w_i)$
  - where $q(X \rightarrow w_i) = 0$ if $X \rightarrow w_i$ is not in the grammar
- Recursive case:
  - for all $i = 1...n-1, j = (i + 1)...n, X \in N$
  - $\pi[i,j,X] = \max\limits_{X\rightarrow YZ \in R, s \in \{i...(j-1)\}} (q(X \rightarrow YZ) \times \pi[i,s,Y] \times \pi[s+1,j,Z])$

## Dependency Parsing

This is where you connect words in a sentence to indicate dependencies between them

It's built around the notion of having heads and dependents

Arrows can be annotated by different types of dependencies:

- Head, also called argument: origin
- Dependent, also called modifier: destiny

Arrows go from a head to a dependent

There are versions with and without typed dependencies,

Typed version has more reach but requires more annotation to build parses

They can also be represented in tree form

The main differences are:

- No nodes corresponding to phrasal constituents or lexical categories
- The internal structure consists only of directed relations between pairs of lexical terms
- These relationships allow directly encoding important information, e.g. the arguments to the verb prefer are directly liked to it in the dependency structure

The main advantages are:

- Ability to deal with languages that are morphologically rich and may have a relatively free word order
- PSG would have to represent two rules for each possible place of the adverb
- Dependency approach: only one link; abstracts away the word order
- Head-dependent relations provide approximation to semantic relationship between predicated and arguments
- Can be directly used to solve problems such as co-reference resolution, question answering etc.

Mappings:

Lexicalised phrase structure parse $\rightarrow$ dependency parse - follow the heads

Dependency parse $\rightarrow$ phrase structure - can do, but dependents are flat

A dependency structure is a directed graph \$G = (V,A), where:

- $V$ = set of vertices (words, punctuation, ROOT)
- $A$ = set of ordered pairs of vertices (arcs)

A dependency tree (directed graph) has to:

- A single ROOT node that has no incoming arcs
- Each vertex has exactly one incoming arc (except ROOT)
- There's a unique path from ROOT to each vertex
- There are no cycles

This ensures:

- Dependency structure becomes a tree
- Each word has a single head
- The dependency tree is connected
- There is a single ROOT from which a unique directed path follows to each word in sentence

There are multiple approaches to dependency parsing:

- Dynamic programming (cubic time, not very accurate)
- Shift-reduce (transition based)
  - Predict from left-to-right
  - Fast (linear), but slightly less accurate
  - MALT parser
- Spanning tree (graph-based, constraint satisfaction)
  - Calculate full tree at once
  - Slightly more accurate, slower
  - MST parser

### Transition-based

This is deterministic parsing

Greedy choice of attachment for each word in order, guided by ML classifier

It works very well, and has linear time parsing

- Reads sentence word by word, left to right
- Greedy decision as to how to attach each word as it is read
- Sequence of actions bottom ip
- Formally, 3 data structures:
  - $\sigma$ = stack, which starts with ROOT
  - $\beta$ = buffer, which starts with all words in sentence
  - $A$ = set of arcs, which starts empty
- SEt of actions:
  - Shift / left arc / right arc
  - Optionally, set of dependency labels for left and right arc actions

We make the shift/reduce right/reduce left decision using an ML classifier

Each action is predicted by a discriminative classifier over each move

For untyped dependencies, 3 classes shift: left or right

For typed dependencies, 2 \* categories + 1 classes

Features: top of stack word, it's POS, first in buffer word, it's POS, etc.

## Neural Parsing

Parsing as translation

- Linearise grammar from treebank - convert tree to bracketed representation, all in one line
- Extract sentences from bracketed representation
- Pair sentences and their linearised trees
- No need to compute/represent probabilities - learning

Train sequence-to-sequence model to translate from:

- Sentences to linearised tree: brackets are tokens!
- Use e.g. LSTM
- Attention helps
- Train with cross-entropy
- Evaluate as a translation (BLEU) or parsing task (parseval)

There are some more advanced approaches, such as:

- Graph-based methods
- Hierarchical sequence-to-sequence models
- Transformer-based
