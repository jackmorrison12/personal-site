---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Language Modelling
slug: language-modelling
topic: 4
hidden: false
tags:
  - Language Modelling
---

## What is Language?

Language is a sequence of symbols (not independent words or pairs of words)

When predicting things from language, for many applications the output is more than just one answer per input

An example of an application is Part-Of-Speech tagging

| I    | saw  | the | boy  | on  | the | hill | with | a   | telescope | .     |
| ---- | ---- | --- | ---- | --- | --- | ---- | ---- | --- | --------- | ----- |
| PRON | VERB | DET | NOUN | ADP | SET | NOUN | ADP  | SET | NOUN      | PUNCT |

Naive Bayes or Logistic Regression could be used for this, by having words and context words as features, but this will lead to ussues with trade-off between size of the context and sparsity

When modelling sequences, you need to treat language as sequences

Some examples of language models are N-gram LMs and Neural LMs

They can be used to:

- Represent sequential input to e.g. classify sentiment
- Predict sequential input e.g. language completion
- Assess sequential input e.g. writing assistant
- Generate sequential output e.g. POS tagging, MT

## Language Models

These are models that assign a probability to each possible text word, given a history of words (a context)

They can either be generalised to entire sentences, or can operate on a character level

They're different to word embeddings as they take into account the context

Some applications are:

- Word completion/word prediction
- Speech recognition
- Spelling correction
- Machine translation

The task of a language model is to compute $P(w|h)$, where $w$ is the word and $h$ is the history, also written as $P(w_n | w_1^{n-1})$

However, for longer histories, this can result in them not being seen in the corpus, and so the probability would be 0

There is not enough data to have long sequences

Therefore, some approaches to tackle this are:

- Chain rule:
  - Decompose the problem
  - Estimate joint probability of an entire word sequence by multiplying together a number of conditional probabilities
  - $P(w_1, ..., w_n) = P(w_1)P(w_2|w_1)P(w_3|w_1,w_2)...P(w_n|w_q^{n-1}) = \prod\limits_{k=1}^nP(w_k|w_1^{k-1})$
  - However, the last term is just what we had before
- Markov assumption:
  - N-gram models approximate the history by just the last few words
  - E.g. a bigram approximation would be $P(w_n|w_{n-1})$
  - E.g. a trigram approximation would be $P(w_n|w_{n-2}, w_{n-1})$
  - In general terms, an N-gram approximation of the full context is $P(w_n|w_1^{n-1}) \approx P(w_n | w_{n-N+1}^{n-1})$

For corpus size, the large, the better the counts, and the higher order n possible

The more "in domain" means more reliable

However, we are multiplying many < 1 numbers, so it maty end up losing value, therefore we can do this in log space and replace multiplication by addition

$log(P(w_1, ..., w_n)) = \sum\limits_{k=1}^n log(P(w_k | w_1^{k-1}))$

One method is to count all possible n-grams and store them as the language model

An example for the sentence "I want chinese food" would be:

$P($ \<s> I want chinese food \</s>$)$

$= P($ I | \<s>$)P($want | i$)P($chinese | want$)P($food | chinese$)P($\</s> | food$)$

And given all of these probabilities are pre-calculated, it's just a matter of looking them up

To decide on the arity of the n-gram:

- The larger the better as long as we have counts from the corpus
- Google uses 5 to 20-grams, but for a corpus of a few million words, trigrams are probably best

### Evaluation LMs

You can measure perplexity on a unseen test corpus

- Inverse probability of a text, normalised by the number of words
- Measure of surprise of a LM upon seeing new text
- Minimising perplexity $\rightarrow$ maximising probability

There are two main uses:

1. Does it prefer real sentences to rarely observed ones - given two corpuses, the one with the lower perplexity is less surprising, and therefore closest to the LM
2. What's the best LM for this in-domain test data? The better one has lower perplexity

$PPL(W) = P(w_1, w_2, ..., w_n)^{-\frac{1}{n}}$

For a bigram, this is:

$= \sqrt[n]{\frac{1}{\prod\limits_{k=1}^n p(w_k | w_{k-1})}}$

It's inversely proportional to the LM score, so n works as a normalising factor for the sentence length

$log(PPL(W)) = -\frac{1}{n} \sum\limits_{k=1}^n log (P(w_k|w_1^{k-1}))$

### Sparsity

You can train on different corpuses - e.g. the WSJ corpus from 10 years ago, which wouldn't perform well on tweets

What happens with unseen n-grams?

There are some techniques to mitigate sparsity, such as add-one smoothing:

- Given words with sparse statistics, steal probability mass from more frequent words
- This has better generalisation
- $P_{add-1}(w_n|w_{n-1}) = \frac{C(w_{n-1}, w_n) + 1}{C(w_{n-1} + V)}$
- This prevents probabilities of 0
- However, a problem is that if there are too many zero counts, this moves too much mass

However, even with a larger n, n-gram language models fail to model long-distance dependencies

## Neural Language Models

N-gram LMs are simple and efficient, but they:

- Take into account limited history of words
- Cannot model long-distance dependencies
- Require special techniques to mitigate count sparsity

DNN-based LMs attempted to solve these issues

- Compositionality avoids n-gram sparsity
- Contextual word representations i.e. embeddings
- Theoretically, infinite history of words

The ideas is to use a DNN to model $P(w_k|w_1^{k-1})$

This could be done for feed-forward or recurrent LMs

NLM are essentially classification tasks, where they try to predict the next word

- Classes are words from a pre-defined vocab
- Input representations may differ between FFLMs and RNNLMs but we always try to predict the next token
- The training objective is to minimise the negative log-likelihood of correct words

### Feed Forward LM

Feed-forward LMs were the first application of DNNs to LM

- It models $P(w_k | w_{k-N+1}^{k-1})$ with a simple NN architechture
- It approximated history with C = N - 1 words, where C affects the model size
- Context is formed by concatenating word embeddings

They give a 10-20% perplexity improvement over a smoothed 3-gram LM

### Recurrent Neural Networks

These are simply a neural network shared across time

They have a constant memory complexity with respect to time, allowing full context (instead of Markov assumption)

They're very powerful for sequence modelling, with the state of the art being gated RNNs such as GRUs or LSTMs

An RNN ($f$) computes its next state $h_t+1$ based on a hidden state vector and input vector at time $t$

$h_{t+1} = f(h_t, x_t) = tanh(Wh_t + Ux_t)$

It's hidden state is carried along as memory

The time for sequences is the position in the sentence

The primary parameters are the two projection matrices:

- $W \in \R^{H X H}$ - hidden-to-hidden
- $U \in \R^{E x H}$ - input to hidden

Unrolling an RNN yields a deep feed-forward network, but:

- Parameters are shared across steps - no copies!
- Recurrence disappears
- Easier to conceptualise forward and backward passes

Each word in the input sentence passes through an embedding layer, and then a projection is done using the RNN with the previous hidden state to produce the next hidden state

There ia a single label per sequence

- The last hidden state $h_T$ is the 'thought' vector
- Other alternatives are averaging or max-pooling all hidden states $h_{1:T}$

#### BPTT

Back-propagation is done through time (BPTT)

- Every hidden state depends on the previous computation graph
- Gradient of loss will flow all the way back to t-0
- It naturally happens when BP is applied to RNNs

For language modelling, every timestep has a true label, i.e. the next word that we are tryying to predict

There are multiple losses per sequence, and they are added together to form the sequence loss

The LM loss is the sum of cross-entropy losses for each prediction:

$L = - \sum\limits_{t=1}^{|x|} log(P(x_{t+1} | x_{<t}))$

In order to back-propagate through time:

- Each forward pass internally stores the activation which will be required during the backwards pass
- E.g. $tanh'(x) = 1 - tanh^2(x)$

However, for datasets with lots of words, the memory pressure goes up with sequence length, and we cannot delay a backwards pass forever

#### Truncated BPTT

Therefore, we do truncated BPTT

- Perform recurrence as usual for K steps
- Do forward $\rightarrow$ backward $\rightarrow$ update
- Detach the final state \$h_k\$ from the graph
  - $h_k$ iis now completely unaware of how it was computed
  - Gradients will not back-propagate to $t < k$

The long term history is still preserved through $h_k$, meaning the LM still models full conditionals

#### RNN Issues

RNNs still have issues learning long-distance dependencies

The chain rule means multiplying many partial derivatives, so gradients can easily vanish or explode

This causes inconsistencies and unstable learning

To prevent exploding gradients, you can clip then, so if $||g|| > $ threshold T; $g = \frac{g}{||g||}T$

To prevent banishing gradients, you need to use more intelligent RNNs such as gate RNNs

### Gated RNNs

These create paths through time that have derivatives which neither vanish nor explode, by allowing skipping paths

Vanilla RNNs unconditionally overwrite the history, whereas gated RNNs allow learning to retrain or remove information based on the input and the history

An example is an LSTM, where at each time t:

$i_t = \sigma(W_{ii}x_t + W_{hi}h_{t-1} + b_i)$ - input gate

$f_t = \sigma(W_{if}x_t + W_{hf}h_{t-1} + b_f)$ - forget gate

$o_t = \sigma(W_{io}x_t + W_{ho}h_{t-1} + b_o)$ - output gate

$g_t = tanh(W_{ig}x_t + W_{hg}h_{t-1} + b_g)$ - candidate state

$c_t = f_t * c_{(t-q)} + i_t * g_t$ - cell state

$h_t =o_t * tanh(c_t)$ - final output

Gating is useful to regulate information flow and the memory, as memory doesn't have to be erased at each timestep

It allows skipping multiplicative gradient paths

- It's up to them to explicitly vanish gradients if required
- Cell state has additive update rule
  - It can keep its state, partial derivative will be about 1
  - It has 2 backwards paths, $c_{(t-1)}$ and $i_t * g_t$

  
