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

Language is a <mark>sequence of symbols</mark> (not independent words or pairs of words)

When predicting things from language, for many applications the <mark>output is more than just one answer per input</mark>

An example of an application is <mark>Part-Of-Speech tagging</mark>

| I    | saw  | the | boy  | on  | the | hill | with | a   | telescope | .     |
| ---- | ---- | --- | ---- | --- | --- | ---- | ---- | --- | --------- | ----- |
| PRON | VERB | DET | NOUN | ADP | DET | NOUN | ADP  | SET | NOUN      | PUNCT |

Naive Bayes or Logistic Regression could be used for this, by having words and context words as features, but this will lead to issues with trade-off between size of the context and sparsity

When modelling sequences, you need to <mark>treat language as sequences</mark>

Some examples of language models are <mark>N-gram LMs and Neural LMs</mark>

They can be used to:

- <mark>Represent</mark> sequential input to e.g. classify sentiment
- <mark>Predict</mark> sequential input e.g. language completion
- <mark>Assess</mark> sequential input e.g. writing assistant
- <mark>Generate</mark> sequential output e.g. POS tagging, MT

## Language Models

These are models that <mark>assign a probability to each possible text word</mark>, given a history of words (a context)

They can either be generalised to <mark>entire sentences</mark>, or can operate on a character level

They're different to word embeddings as they <mark>take into account the context</mark>

Some applications are:

- Word completion/word prediction
- Speech recognition
- Spelling correction
- Machine translation

The task of a language model is to <mark>compute $P(w|h)$</mark>, where $w$ is the word and $h$ is the history, also written as $P(w_n | w_1^{n-1})$

However, for longer histories, this can result in them not being seen in the corpus, and so the probability would be 0

There is not enough data to have long sequences

Therefore, some approaches to tackle this are:

- Chain rule:
  - Decompose the problem
  - Estimate joint probability of an entire word sequence by multiplying together a number of conditional probabilities
  - $P(w_1, ..., w_n) = P(w_1)P(w_2|w_1)P(w_3|w_1,w_2)...P(w_n|w_q^{n-1}) = \prod\limits_{k=1}^nP(w_k|w_1^{k-1})$
  - However, the last term is just what we had before
- <mark>Markov assumption</mark>:
  - N-gram models approximate the history by just the last few words
  - E.g. a bigram approximation would be $P(w_n|w_{n-1})$
  - E.g. a trigram approximation would be $P(w_n|w_{n-2}, w_{n-1})$
  - In general terms, an N-gram approximation of the full context is $P(w_n|w_1^{n-1}) \approx P(w_n | w_{n-N+1}^{n-1})$

For corpus size, <mark>the larger, the better</mark> the counts, and the higher order n possible

The more "in domain" means more reliable

However, we are multiplying many < 1 numbers, so it may end up losing value, therefore we can do this in <mark>log space</mark> and replace multiplication by addition

$log(P(w_1, ..., w_n)) = \sum\limits_{k=1}^n log(P(w_k | w_1^{k-1}))$

One method is to <mark>count all possible n-grams</mark> and <mark>store them as the language model</mark>

An example for the sentence "I want chinese food" would be:

$P($ \<s> I want chinese food \</s>$)$

$= P($ I | \<s>$)P($want | i$)P($chinese | want$)P($food | chinese$)P($\</s> | food$)$

And given all of these probabilities are pre-calculated, it's just a matter of <mark>looking them up</mark>

To decide on the arity of the n-gram:

- The larger the better as long as we have counts from the corpus
- Google uses 5 to 20-grams, but for a corpus of a few million words, trigrams are probably best

### Evaluation LMs

You can measure <mark>perplexity</mark> on a unseen test corpus

- <mark>Inverse probability</mark> of a text, normalised by the number of words
- <mark>Measure of surprise</mark> of a LM upon seeing new text
- Minimising perplexity $\rightarrow$ maximising probability

There are two main uses:

1. Does it <mark>prefer real sentences to rarely observed ones</mark> - given two corpuses, the one with the lower perplexity is less surprising, and therefore closest to the LM
2. What's the <mark>best LM for this in-domain test data</mark>? The better one has lower perplexity

$PPL(W) = P(w_1, w_2, ..., w_n)^{-\frac{1}{n}}$

For a bigram, this is:

$= \sqrt[n]{\frac{1}{\prod\limits_{k=1}^n p(w_k | w_{k-1})}}$

It's <mark>inversely proportional to the LM score</mark>, so n works as a normalising factor for the sentence length

$log(PPL(W)) = -\frac{1}{n} \sum\limits_{k=1}^n log (P(w_k|w_1^{k-1}))$

### Sparsity

You can <mark>train on different corpuses</mark> - e.g. the WSJ corpus from 10 years ago, which wouldn't perform well on tweets

What happens with <mark>unseen n-grams</mark>?

There are some techniques to mitigate sparsity, such as <mark>add-one smoothing</mark>:

- Given words with sparse statistics, steal probability mass from more frequent words
- This has better generalisation
- $P_{add-1}(w_n|w_{n-1}) = \frac{C(w_{n-1}, w_n) + 1}{C(w_{n-1} + V)}$
- This prevents probabilities of 0
- However, a problem is that if there are too many zero counts, this moves too much mass

However, even with a larger n, n-gram language models fail to model long-distance dependencies

## Neural Language Models

N-gram LMs are simple and efficient, but they:

- Take into account <mark>limited history of words</mark>
- Cannot model <mark>long-distance dependencies</mark>
- Require special techniques to mitigate count sparsity

DNN-based LMs attempted to solve these issues

- <mark>Compositionality</mark> avoids n-gram sparsity
- <mark>Contextual word representations</mark> i.e. embeddings
- Theoretically, <mark>infinite history of words</mark>

The ideas is to <mark>use a DNN to model $P(w_k|w_1^{k-1})$</mark>

This could be done for feed-forward or recurrent LMs

NLM are essentially <mark>classification tasks</mark>, where they try to <mark>predict the next word</mark>

- Classes are words from a pre-defined vocab
- Input representations may differ between FFLMs and RNNLMs but we always try to <mark>predict the next token</mark>
- The training objective is to <mark>minimise the negative log-likelihood of correct words</mark>

### Feed Forward LM

<mark>Feed-forward LMs</mark> were the first application of DNNs to LM

- It models $P(w_k | w_{k-N+1}^{k-1})$ with a simple NN architechture
- It approximated history with C = N - 1 words, where C affects the model size
- Context is formed by concatenating word embeddings

They give a 10-20% perplexity improvement over a smoothed 3-gram LM

### Recurrent Neural Networks

These are simply a <mark>neural network shared across time</mark>

They have a <mark>constant memory complexity</mark> with respect to time, allowing full context (instead of Markov assumption)

They're very powerful for sequence modelling, with the state of the art being gated RNNs such as GRUs or LSTMs

An RNN ($f$) <mark>computes its next state $h_t+1$</mark> based on a <mark>hidden state</mark> vector and <mark>input vector</mark> at time $t$

$h_{t+1} = f(h_t, x_t) = tanh(Wh_t + Ux_t)$

It's <mark>hidden state is carried along as memory</mark>

The time for sequences is the position in the sentence

The primary parameters are the two projection matrices:

- $W \in \R^{H X H}$ - hidden-to-hidden
- $U \in \R^{E x H}$ - input to hidden

Unrolling an RNN yields a <mark>deep feed-forward network</mark>, but:

- <mark>Parameters are shared across steps</mark> - no copies!
- Recurrence disappears
- Easier to conceptualise forward and backward passes

Each <mark>word</mark> in the input sentence passes through an <mark>embedding layer</mark>, and then a <mark>projection</mark> is done using the RNN with the <mark>previous hidden state</mark> to produce the next hidden state

There is a <mark>single label per sequence</mark>

- The last hidden state $h_T$ is the 'thought' vector
- Other alternatives are averaging or max-pooling all hidden states $h_{1:T}$

#### BPTT

Back-propagation is done through time (BPTT)

- Every <mark>hidden state depends on the previous</mark> computation graph
- Gradient of loss will <mark>flow all the way back to t=0</mark>
- It naturally happens when BP is applied to RNNs

For language modelling, every timestep has a true label, i.e. the next word that we are tryying to predict

There are <mark>multiple losses per sequence</mark>, and they are <mark>added together </mark>to form the sequence loss

The LM loss is the sum of cross-entropy losses for each prediction:

$L = - \sum\limits_{t=1}^{|x|} log(P(x_{t+1} | x_{<t}))$

In order to back-propagate through time:

- Each forward pass internally stores the activation which will be required during the backwards pass
- E.g. $tanh'(x) = 1 - tanh^2(x)$

However, for datasets with lots of words, the memory pressure goes up with sequence length, and we cannot delay a backwards pass forever

#### Truncated BPTT

Therefore, we do truncated BPTT

- Perform <mark>recurrence as usual for K steps</mark>
- Do forward $\rightarrow$ backward $\rightarrow$ update
- <mark>Detach the final state</mark> \$h_k\$ from the graph
  - $h_k$ is now <mark>completely unaware</mark> of how it was computed
  - Gradients will <mark>not back-propagate to $t < k$</mark>

The long term history is still <mark>preserved through $h_k$</mark>, meaning the LM still models full conditionals

#### RNN Issues

RNNs still have <mark>issues learning long-distance dependencies</mark>

The <mark>chain rule</mark> means multiplying many partial derivatives, so gradients can easily vanish or explode

This causes inconsistencies and unstable learning

To prevent <mark>exploding gradients</mark>, you can <mark>clip them</mark>, so if $||g|| > $ threshold T; $g = \frac{g}{||g||}T$

To prevent <mark>vanishing gradients</mark>, you need to use more intelligent RNNs such as <mark>gated RNNs</mark>

### Gated RNNs

These create paths through time that have <mark>derivatives which neither vanish nor explode</mark>, by allowing <mark>skipping paths</mark>

Vanilla RNNs unconditionally overwrite the history, whereas gated RNNs allow learning to retrain or remove information based on the input and the history

An example is an LSTM, where at each time t:

$i_t = \sigma(W_{ii}x_t + W_{hi}h_{t-1} + b_i)$ - input gate

$f_t = \sigma(W_{if}x_t + W_{hf}h_{t-1} + b_f)$ - forget gate

$o_t = \sigma(W_{io}x_t + W_{ho}h_{t-1} + b_o)$ - output gate

$g_t = tanh(W_{ig}x_t + W_{hg}h_{t-1} + b_g)$ - candidate state

$c_t = f_t * c_{(t-q)} + i_t * g_t$ - cell state

$h_t =o_t * tanh(c_t)$ - final output

Gating is useful to regulate information flow and the memory, as <mark>memory doesn't have to be erased at each timestep</mark>

It allows <mark>skipping multiplicative gradient paths</mark>

- It's up to them to explicitly vanish gradients if required
- Cell state has additive update rule
  - It can keep its state, partial derivative will be about 1
  - It has 2 backwards paths, $c_{(t-1)}$ and $i_t * g_t$
