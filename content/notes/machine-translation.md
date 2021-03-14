---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Machine Translation
slug: machine-translation
topic: 6
hidden: false
tags:
  - Machine Translation
---

## What is Machine Translation?

Given a document in source language $S$, produce a translation in target language $T$

It requires different levels of understanding and transfer:

- Lexical (word choices) - e.g. word to word
- Syntactic (word order) - e.g. syntax trees
- Semantic (expressions) - e.g. understanding idioms and ambiguities

It's challenging, due to things like word sense ambiguities and multiple translations

## Statistical Machine Translation

This was the previous prominent approach before neural models

It's a pipeline of several sub-models and features:

- Translation model: probabilistic phrase (n-gram) pair tables
- Alignment model: for reordering phrases between languages
- Language model: for ensuring target language fluency

There was then a final model tuned for weighing the features

$log(P(Y|X)) = \sum\limits_{i=1}^N \lambda_if_i(X,Y) + \lambda_{LM}f_{LM}(Y)$

Given a parallel dataset of source and target language sentences, pairs of phrases are extracted, and then the translation model looks up probabilities of encodings from one language to the other

Also given the language model of the target language, this is combined with other feature functions in order to produce the best translation

Disadvantages:

- Requires human expertise for feature engineering
- A huge pipeline = painful to train
- Explicit phrase tables where model size increases with training set size
- It's also language specific

Therefore, neural machine translation is now used, since it has:

- End-to-end approach to MT using DNNs
- Minimum to no feature engineering

## MT Evaluation

- Human Evaluation
  - This is the gold standard, but infeasible
  - Direct assessment can use used for quality estimation
- Automatic evaluation metrics
  - Simple/fast proxy measures for translation quality
  - Often based on count statistics (system outputs vs ground-truth human translations)
  - There are many choices, such as BLEU, METEOR, Chr-F and TER

### BLEU

This is the most popular MT metric

It measures the similarity between hypotheses and references

- Precision of n-gram matches
- Shorter translations are penalised with a brevity penalty
- Multiple references are recommended if available

### METEOR

This is a sentence-based metric

- It has unigram precision and recall with R weighted higher than P
- Longer n0gram matches are used to compute a penalty term - if none, the score is heavily penalised
- Considers lexical diversity (stemming \$ synonym matching)

### Translation Error Rate (TER)

This is the minimum number of edits required to change a hypotheses into one of the references

## Neural Machine Translation

Notation:

- A source sentence with S words: $X = \{x_1,...,x_S\}$
- A target sentence with T words: $Y = \{y_1,...,y_T\}$
- An arbitrary encoder function: $E()$
- An arbitrary decoder function: $D()$
- A parallel corpus of N sentence pairs: $C = \{(X^{(1)}, Y^{(1)}),...,(X^{(N)}, Y^{(N)})\}$
- Joint log-probability of the raining corpus: $log(P(C)) = \sum\limits_{i=1}^N log (P((X^{(i)}, Y^{(i)}))) = \sum\limits_{i=1}^N\sum\limits_{t=1}^T log(P(y_t^{(i)}|y_{<t}^{(i)},X^{(i)}))$
  - Where:
  - $y_t^{(i)}$ is the word of the target sentence
  - $y_{<t}^{(i)}$is the prefix of the target word (translation history)
  - $X^{(i)}$ is the full source sentence
- Maximum likelihood estimation (MLE): minimise negative log-likelihood $-log(P(C))$

In an encoder-decoder NMT:

- Encode a sentence into some sort of representation
- Decode the translation from that representation

For the encoder/decoder, you can use:

- Bi-directional GRU/LSTM encoders, GRU/LSTM decoders
- Transformer Encoders & Decoders

The source sentence can be represented as:

- A single latent state (in RNNs)
- A collection of latent states

The decoder uses that representation by:

- Initialising its hidden state with the latent vector (in RNNs)
- Refers to the collection of latent states at each timestep

### Recurrent MT

Encoder:

- Many-to-many framework
- Encodes the input embeddings, producing a hidden state $h_t$ for each input
- The final latent stats are $H = \{h_1,...,h_S\}$

Bi-directional encoder:

- RNNs scan sequences from left to right (forwards)
  - This means that the hidden state $h_t$ is likely to forget earlier words
- Therefore, we add another encoder to scan backwards
  - The final states $H$ are not a concatenation of forward and backwards states

Decoder:

- The recurrent decoder is a conditional LM which models:
  - Fluency by intrinsic LM nature
  - Adequacy by conditioning over the source representation
  - $P(y_t^{(i)} | t_{<t}^{(i)}, X^{(i)})$

Training:

- Input sentence is fed through the encoder
- Hidden states are produced
- Hidden states are compressed to form $v$, which summarises the source sentence and is used to initialise the decoder
- $v$ could be the last encoding state, or the mean encoding state, or max pool etc...
- Then the translated sentence is fed in to the decoder too, and with $v$ it produces the output prediction
- The loss is calculated on the prediction, and gradient descent is done

The bottleneck is that gradients are likely to vanish towards early source word representations, so we need to ease the gradient flow

### Recurrent MT with Attention

Attention mechanism offers an elegant solution to overcome the bottleneck

It uses all states $H$ instead of a constant vector $v$

There are two main flavours: MLP and DOT

At each decoder timestep, you compute a different source representation $c_t$ (context):

- Compute a similarity $s_i$ between the hidden state $d_t$ of the decoder and each encoder state $h_i \in H$
  - In DOT: this is computed using a dot product
  - $s_i = h_t^Td_t$
  - $h_i, d_t \in \R^k$
  - In MLP: this is computed with a learnable feed-forward layer
  - $s_i = \alpha^T tanh(W_dd_t+W_sh_i)$
- Normalise similarity scores to obtain a weight distribution $\{\alpha_1,...,\alpha_S\} = softmax(\{s_1,...,s_S\})$
- Weigh the encoder states using the attention weights $c_t = \sum\limits_{i=1}^S \alpha_ih_i$

This prevents the vanishing gradient, so longer sentences are handled better

### Output Size

A fixed size of word vocabulary is often too large, and it cannot generate new surface forms

A character-level NMT can represent any string, but the sentences are much longer

A subword-level NMT is somewhat on-between, and is usually the current choice

### Subword Approach (BPE)

The approximate vocabulary size is pre-determined, usually between 30,000 and 50,000

A segmentation model is learned from a training corpus:

- Start with a character vocabulary
- Merge frequent unit pairs, store the merge rule, extend vocab
- Step when the target number of merge ops is reached

At application time, start with character-level units and apply the rules from the merge table

### Data Augmentation

A large corpus is crucial for production setups

Back-translation can be used, where:

1. Train a T $\rightarrow$ S model
2. Translate monolingual corpora in T to S
3. Train the actual S $\rightarrow$ T model with additional S data from (2)

### Multilinguality

We can train a single NMT to train between different language pairs, which cuts down on the number of parameters

## Translation decoding and evaluation

At training time, we use the ground-truth target words as input to the decoder

This is called "teacher forcing" and is similar to how we train RNNLMs

At test time, the model is on its own to perform this translation, and therefore it uses its own predictions

So the first input will always be \<s>, and then the output of the first prediction will be the input to the second one

Decoding ends when the highest word probability is \</s>

The correct translation lies within the search space. but BFS is not feasible

Therefore, you do approximate search: decoding begins with \<s> and ends when \</s> is produced

Greedy search always looks for the best prediction by taking the argmax of softmax probabilities at each timestep

$\hat{y} = argmax(P(y_t|X;y_{<t}))$, where $\hat{k}$ is the number of words in the translation

Beam search evaluates more candidates

- It prunes the graph to tok-k candidates at each step
- k is typically around 10


