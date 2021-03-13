---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Part-of-Speech Tagging
slug: pos-tagging
topic: 5
hidden: false
tags:
  - Part-of-Speech Tagging
---

Part-of-Speech Tagging gives each word in a sentence a tag, such as:

| I    | saw  | the | boy  | on  | the | hill | with | a   | telescope | .     |
| ---- | ---- | --- | ---- | --- | --- | ---- | ---- | --- | --------- | ----- |
| PRON | VERB | DET | NOUN | ADP | DET | NOUN | ADP  | SET | NOUN      | PUNCT |

The tags for a Tagset, which can be split into:

- Open class tags (large number of words for each tag and enw words created regularly):
  - ADJ (adjective - old, beautiful)
  - ADV (adverb - slowly, there, quite)
  - INTJ (interjection - psst, ouch, help, ow)
  - NOUN (noun - person, cat, play)
  - PROPN (proper noun - London, Jack)
  - VERV (verb - enter, clean, play)
- Closed class tags (finite, small set of words per tag):
  - PREP (preposition - in, on, to, with)
  - AUX (auxiliary verb - can, shall, must)
  - CCONJ (coordinating conjunction - and, or)
  - DET (determiner - a, the)
  - NUM (numerical - one, 200)
  - PART (particle - off, up)
  - PRON (pronoun - he, yourself)
  - SCONJ (subordinating conjunction - that, if, while)
- There are also other tags:
  - PUNCT (punctuation - . , )
  - SYM (symbol - \$, %, §)
  - X (other)

## Baseline POS Tagging Method

The Naive approach is:

- Assign each word its most frequent POS tag from teh training corpus
- Assign all unknown words NOUN (as this is the most common tag)

This gets around 90% accuracy

However, there are ambiguities, such as the word 'back' in these sentences:

- The back door (ADJ)
- On my back (NOUN)
- Win the voters back (ADV)
- Promised to back the bill (VERB)

## Probabilistic POS Tagging

This uses frequencies but takes context into account

- Given a sequence of words $W = w_1, w_2, ..., w_n$
  - Estimate the sequence of POS tags $T = t_1, t_2, ..., t_n$
  - Compute $P(T|W)$

This is an instance of many-to-many classification

The generative approach, where you guess the most likely sequence of tags that generates those words, uses Bayes theorem:

$p(T|W) = \frac{P(W|T)P(T)}{P(W)} = P(W|T)P(T)$ (as $P(W)$ is constant)

Using the chain rule and markov assumption (bigram):

$P(T) \approx P(t_1)P(t_2|t_1)P(t_2|t_2)...P(t_n|t_{n-1})$

Each word only depends on its tag, not the previous word, therefore:

$P(W|T) \approx P(w_1|t_1)P(w_2|t_2)...P(w_n|t_n)$

Putting this all together, we get:

$p(T|W) \approx P(t_1)P(t_2|t_1)P(t_2|t_2)...P(t_n|t_{n-1}) P(w_1|t_1)P(w_2|t_2)...P(w_n|t_n)$

$\approx P(t_1)P(w_1|t_1)P(t_2|t_1)P(w_2|t_2)...P(t_n|t_{n-1})P(w_n|t_n)$

Where these can be measured using counts:

- $P(t_i|t_{i-1}) = \frac{C(t_{i-1}, t_i)}{C(t_{i-1})}$
- $P(w_i|t_i) = \frac{C(w_i, t_i)}{C(t_i)}$

The algorithm is:

- Generate the tables for $P(t_i|t_{i-1})$ and $P(w_i|t_i)$ from the corpus during training
- Take a test sentence, and tag the sentence left to right using $P(t_i|t_{i-1}) \times P(w_i|t_i)$, taking the max at every step to be the POS for that word

However, there are issues using the local maximum for each word, as we are ignoring more promising paths overall by sticking to one decision at a step

Therefore, instead, we compute the best tag sequence $\hat{T}$, one that maximises $p(T|W)$

We improve the approach using:

- Markov Chains:
  - Model probabilities of sequences of random variables (states)
  - We build upon states as we go
- Hidden Markov Chains
  - The states are not given, but hidden
  - Words are observed
  - POS are hidden

### HMM Tagger

This allows us to infer hidden states from observations

- $Q = q_1q_2...q_N$ - A set of N states (tags)
- $A = a_{11}a_{ij}...a_{NN}$ - A transition probability matrix $A$, each $A_{ij}$ representing the probability P of moving from state i to state j, such that $\sum\limits_{j-1}^N a_{ij} = 1\  \forall i$
- $O = o_1o_2...o_T$ - A sequence of T observations (words), each one drawn from a vocabulary
- $B = b_i(o_t)$ - A sequence of observation likelihoods (emission probabilities), each expressing the probability of an observation $o_t$ being generated from state i
- $\pi = \pi_1,...,\pi_N$ - $\pi_i$ is the probability that the chain will start in state i $\sum\limits_{i=1}^N \pi_i = 1$

We make the following assumptions:

- Markov: to predict the future tag in the sequence, all that matters is the current state
- Independence: the probability of an output observation (word) $o_i$ depends only on the state that produced the observation $q_i$

The formulation stays the same:

$p(T|W) \approx P(t_1)P(t_2|t_1)P(t_2|t_2)...P(t_n|t_{n-1}) P(w_1|t_1)P(w_2|t_2)...P(w_n|t_n)$

$\approx P(t_1)P(w_1|t_1)P(t_2|t_1)P(w_2|t_2)...P(t_n|t_{n-1})P(w_n|t_n)$

Where $P(w_i|t_i)$ are emission probabilities and $P(t_i|t_{i-1})$ are transition probabilities

Decoding/inference is the task of determining the hidden state sequence corresponding to the sequence of observations

Given as input an HMM model (the two tables) $\lambda$ and a sequence of observations $O - o_1o_2...o_T$ (test case) - we need to find the most probable sequence of states $Q = q_1q_2...q_T$

$\hat{T} = argmax_TP(T|W)$

$\approx argmax \prod\limits_{i=1}^N P(w_i|t_i)P(t_i|t_{i-1})$

This is done using the Viterbi algorithm

This is an efficient dynamic programming algorithm of ifnerence over the HMM model

It returns the best sequence of tokens to make the probability as high as possible

$v_t(j)$ is the Viterbi path probability of column $t$ and row $j$, i.e. the probability that the HMM is in state $j$ after seeing the first $t$ observations
and passing through the most probable state sequence $q_1...q_{t-1}$

Steps:

1. First build a lattice/matrix
2. There should be one column per observation and one row per state
3. Each node $v_t(j)$ is the probability that the HMM is in state $j$ after seeing the first $t$ observations and passing through the most probable state sequence $q_1...q_{t-1}$
4. The value of each $v_t(j)$ is computed by recursively taking the most probable path that could lead to this node
5. The probability of being in every state at time $t-1$ is already computed, so Viterbi probability is simply the most probably extensions of the paths that lead to the current cell

$v_t(j) = max_{i-1}^N v_{t-1}(i)a_{ij}b_j(o_t)$

Where:

- $v_{t-1}(i)$ is the previous Viterbi path probability from the previous time step
- $a_{ij}$ is the transition probability from the previous state $q_i$ to the current state $q_j$
- $b_j(o_t)$ is the emission probability of symbol $o_t$ given the current state $j$

To figure out which sequence of tags is the best:

1. Start from the end, trace backwards all the way to the beginning (each state only has one incoming edge, so there's a single path to the beginning)
2. This gives us the chain of states that generates the observations with the highest probability

The number of possible paths grows exponentially with the length of the input

The running time is O(SN$^2$), where S is the length of the input and N is the number of states in the model

Some tagsets are very large (50+ tags), so bean search is an alternative decoding pattern, where at every step, you only expand the top k most promising paths

### MEMM for POS Tagging

HMM is a generative model, powerful, but limited in the features it can use

An alternative is the sequence version of a logistic regression classifier - maximum entropy classifier

This is a discriminative model to directly estimate posterior

It could use features such as $w_i$ contains a particular prefix, or $w_i$ contains a hyphen

### RNN for POS Tagging

The RNN will assign a label from a small tagset to each word in the sequence

- Inputs: word embedding per word
- Outputs: tag probabilities from a softmax later over tagset
- RNN: 1 input, 1 output, 1 hidden layer, U, V, W shared
- Training: cross entropy loss over tagset for each word, sequence loss is the sum of loss for all words
- Inference: Run forward inference over the input sequence and select the most likely tag from the softmax at each step. Decision fro each word in the sequence is taken independently from decision for other words
