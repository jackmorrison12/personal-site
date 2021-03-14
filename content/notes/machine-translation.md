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

Given a document in <mark>source language $S$</mark>, produce a translation in <mark>target language $T$</mark>

It requires different levels of understanding and transfer:

- <mark>Lexical</mark> (word choices) - e.g. word to word
- <mark>Syntactic</mark> (word order) - e.g. syntax trees
- <mark>Semantic</mark> (expressions) - e.g. understanding idioms and ambiguities

It's challenging, due to things like <mark>word sense ambiguities</mark> and <mark>multiple translations</mark>

## <mark>Statistical</mark> Machine Translation

This was the previous prominent approach before neural models

It's a pipeline of several sub-models and features:

- <mark>Translation model:</mark> probabilistic phrase (n-gram) pair tables
- <mark>Alignment model:</mark> for reordering phrases between languages
- <mark>Language model:</mark> for ensuring target language fluency

There was then a <mark>final model</mark> tuned for weighing the features

$log(P(Y|X)) = \sum\limits_{i=1}^N \lambda_if_i(X,Y) + \lambda_{LM}f_{LM}(Y)$

Given a parallel dataset of source and target language sentences, <mark>pairs of phrases</mark> are extracted, and then the translation model looks up probabilities of encodings from one language to the other

Also given the <mark>language model of the target language</mark>, this is combined with other feature functions in order to produce the best translation

Disadvantages:

- Requires human expertise for <mark>feature engineering</mark>
- A huge pipeline = <mark>painful to train</mark>
- Explicit phrase tables where model size increases with training set size
- It's also <mark>language specific</mark>

Therefore, neural machine translation is now used, since it has:

- End-to-end approach to MT using DNNs
- Minimum to no feature engineering

## MT Evaluation

- <mark>Human Evaluation</mark>
  - This is the gold standard, but infeasible
  - Direct assessment can use used for quality estimation
- <mark>Automatic evaluation metrics</mark>
  - Simple/fast proxy measures for translation quality
  - Often based on count statistics (system outputs vs ground-truth human translations)
  - There are many choices, such as BLEU, METEOR, Chr-F and TER

### <mark>BLEU</mark>

This is the most popular MT metric

It measures the <mark>similarity between hypotheses and references</mark>

- Precision of n-gram matches
- Shorter translations are penalised with a brevity penalty
- Multiple references are recommended if available

### <mark>METEOR</mark>

This is a <mark>sentence-based metric</mark>

- It has unigram precision and recall with R weighted higher than P
- Longer n0gram matches are used to compute a penalty term - if none, the score is heavily penalised
- Considers lexical diversity (stemming \$ synonym matching)

### Translation Error Rate <mark>(TER)</mark>

This is the <mark>minimum number of edits</mark> required to change a hypotheses into one of the references

## Neural Machine Translation

Notation:

- A <mark>source sentence</mark> with S words: $X = \{x_1,...,x_S\}$
- A <mark>target sentence</mark> with T words: $Y = \{y_1,...,y_T\}$
- An arbitrary <mark>encoder function</mark>: $E()$
- An arbitrary <mark>decoder function</mark>: $D()$
- A <mark>parallel corpus of N sentence pairs</mark>: $C = \{(X^{(1)}, Y^{(1)}),...,(X^{(N)}, Y^{(N)})\}$
- <mark>Joint log-probability</mark> of the training corpus: $log(P(C)) = \sum\limits_{i=1}^N log (P((X^{(i)}, Y^{(i)}))) = \sum\limits_{i=1}^N\sum\limits_{t=1}^T log(P(y_t^{(i)}|y_{<t}^{(i)},X^{(i)}))$
  - Where:
  - $y_t^{(i)}$ is the word of the target sentence
  - $y_{<t}^{(i)}$is the prefix of the target word (translation history)
  - $X^{(i)}$ is the full source sentence
- Maximum likelihood estimation <mark>(MLE)</mark>: minimise negative log-likelihood $-log(P(C))$

In an <mark>encoder-decoder</mark> NMT:

- Encode a sentence into some sort of representation
- Decode the translation from that representation

For the encoder/decoder, you can use:

- <mark>Bi-directional GRU/LSTM</mark> encoders, GRU/LSTM decoders
- Transformer Encoders & Decoders

The <mark>source sentence</mark> can be represented as:

- A <mark>single latent state</mark> (in RNNs)
- A <mark>collection of latent states</mark>

The <mark>decoder</mark> uses that representation by:

- Initialising its <mark>hidden state</mark> with the latent vector (in RNNs)
- Refers to the <mark>collection of latent states</mark> at each timestep

### Recurrent MT

<mark>Encoder:</mark>

- Many-to-many framework
- Encodes the input embeddings, producing a <mark>hidden state $h_t$ for each input</mark>
- The final latent stats are $H = \{h_1,...,h_S\}$

<mark>Bi-directional encoder:</mark>

- RNNs scan sequences from left to right (forwards)
  - This means that the hidden state $h_t$ is likely to forget earlier words
- Therefore, we add another <mark>encoder to scan backwards</mark>
  - The final states $H$ are not a concatenation of forward and backwards states

<mark>Decoder:</mark>

- The recurrent decoder is a conditional LM which models:
  - Fluency by intrinsic LM nature
  - Adequacy by conditioning over the source representation
  - $P(y_t^{(i)} | t_{<t}^{(i)}, X^{(i)})$

<mark>Training:</mark>

- <mark>Input sentence</mark> is fed through the encoder
- <mark>Hidden states</mark> are produced
- Hidden states are compressed to form <mark>$v$</mark>, which summarises the source sentence and is used to initialise the decoder
- $v$ could be the <mark>last encoding state</mark>, or the mean encoding state, or max pool etc...
- Then the translated sentence is <mark>fed in to the decoder too</mark>, and with $v$ it produces the output prediction
- The <mark>loss</mark> is calculated on the prediction, and <mark>gradient descent</mark> is done

The bottleneck is that <mark>gradients are likely to vanish</mark> towards early source word representations, so we need to ease the gradient flow

### Recurrent MT with <mark>Attention</mark>

Attention mechanism offers an elegant solution to overcome the bottleneck

It <mark>uses all states</mark> $H$ instead of a constant vector $v$

There are two main flavours: <mark>MLP</mark> and <mark>DOT</mark>

At each decoder time step, you compute a different source representation $c_t$ (context):

- Compute a <mark>similarity</mark> $s_i$ between the <mark>hidden state</mark> $d_t$ of the decoder and each <mark>encoder state</mark> $h_i \in H$
  - In DOT: this is computed using a <mark>dot product</mark>
  - $s_i = h_t^Td_t$
  - $h_i, d_t \in \R^k$
  - In MLP: this is computed with a <mark>learnable feed-forward layer</mark>
  - $s_i = \alpha^T tanh(W_dd_t+W_sh_i)$
- <mark>Normalise similarity scores</mark> to obtain a weight distribution $\{\alpha_1,...,\alpha_S\} = softmax(\{s_1,...,s_S\})$
- <mark>Weigh the encoder states</mark> using the attention weights $c_t = \sum\limits_{i=1}^S \alpha_ih_i$

This prevents the vanishing gradient, so longer sentences are handled better

### Output Size

A fixed size of word vocabulary is often too large, and it cannot generate new surface forms

A character-level NMT can represent any string, but the sentences are much longer

A <mark>subword-level NMT</mark> is somewhat on-between, and is usually the current choice

### Subword Approach (BPE)

The approximate vocabulary size is pre-determined, usually between 30,000 and 50,000

A segmentation model is learned from a training corpus:

- Start with a <mark>character vocabulary</mark>
- <mark>Merge frequent unit pairs</mark>, <mark>store the merge rule</mark>, extend vocab
- Stop when the target number of merge ops is reached

At application time, start with character-level units and <mark>apply the rules from the merge table</mark>

### Data Augmentation

A large corpus is crucial for production setups

<mark>Back-translation</mark> can be used, where:

1. Train a T $\rightarrow$ S model
2. Translate monolingual corpora in T to S
3. Train the actual S $\rightarrow$ T model with additional S data from (2)

### Multilinguality

We can train a single NMT to train between different language pairs, which cuts down on the number of parameters

## Translation decoding and evaluation

At <mark>training time</mark>, we use the <mark>ground-truth target words</mark> as input to the decoder

This is called <mark>"teacher forcing"</mark> and is similar to how we train RNNLMs

At <mark>test time</mark>, the model is on its own to perform this translation, and therefore it <mark>uses its own predictions</mark>

So the first input will always be \<s>, and then the output of the first prediction will be the input to the second one

<mark>Decoding ends</mark> when the <mark>highest word probability</mark> is <mark>\</s></mark>

The correct translation lies within the search space. but BFS is not feasible

Therefore, you do approximate search: decoding begins with \<s> and ends when \</s> is produced

<mark>Greedy search</mark> always looks for the best prediction by taking the argmax of softmax probabilities at each timestep

$\hat{y} = argmax(P(y_t|X;y_{<t}))$, where $\hat{k}$ is the number of words in the translation

<mark>Beam search</mark> evaluates more candidates

- It prunes the graph to tok-k candidates at each step
- k is typically around 10
