---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Transformers
slug: transformers
topic: 7
hidden: false
tags:
  - Transformers
---

## What are transformers

- <mark>MLP based-models</mark>
- <mark>No recurrence</mark>
- State-of-the-art <mark>sequence-to-sequence</mark> model
- Enables massive pre-training

There are multiple types of transformer:

1. <mark>Self-attention</mark>
2. <mark>Positional Encoding</mark>
3. <mark>Encoder-Decoder</mark> Structure

## What is Attention?

Attention is essentially an <mark>additional NN</mark> to help learn a better representation

It allows for <mark>better back-propagation</mark>, and is especially useful on <mark>longer sentences</mark>

No matter the size of the context, it will be <mark>summed to an equal-size vector</mark> - it doesn't need to change the NN structure

An inductive bias allows a learning algorithm to <mark>prioritise one solution over another</mark>, independent of the observed data

### Self-Attention

This is an attention mechanism, exploiting <mark>relational context information</mark> by attending queries to different positions among the same context

$Attention(Q,K,V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$

We take the key and the query, take the product of this, then so the softmax, and then do the weighted sum with the vale in order to get the sequence representation

### Multi-Head Self Attention

$MultiHead(Q,K,V) = Concat(head_1,...,head_h)W^O$ where $head_i = Attention(QK_i^Q, KW_i^K, VW_i^V)$

We expect different head captures different relational bias from a different perspective

## Positional Encoding

The self-attention models have no sense of position/order for each word

- Discrete Positional Embedding: \[0,1,2,...,512\] (up to a limit)
  - No - can't scale up over limit
- Normalised to a unit: \[0,1\]
  - No - Cannot identify the number of words
- <mark>Sinusoidal functions:</mark>
  - YES!
  - Unique for each time step
  - Relative positions are invariant for different lengths
  - Scale up to unseen words

$PE_{(pos, 2i)} = sin(pos/10000^{2i/d_{model}})$

$PE_{(pos, 2i+1)} = cos(pos/10000^{2i/d_{model}})$

The <mark>target $PE_{pos+k}$</mark> can be represented as a <mark>linear function of $PE_{pos}$</mark>

$PE_{pos+k}$ can be represented as a linear function of $PE_{pos}$

$PE_{1+2} = F_2(PE_1)$

$PE_{8+2} = F_2(PE_8)$

$f$ is similar to a rotation matrix

$\begin{bmatrix}cos(\lambda_mk)& sin(\lambda_mk) \\ -sin(\lambda_mk)& cos(\lambda_mk)\end{bmatrix} \begin{bmatrix}sin(\lambda_mt) \\cos(\lambda_mt)\end{bmatrix} =\begin{bmatrix}sin(\lambda_m(t+k)) \\cos(\lambda_m(t+k))\end{bmatrix} $

This represents $f(PE_t) = PE_{t+k}$

## Encoder-Decoder Structure

### <mark>Encoder</mark>

This follows the pattern:

- Word IDs
- $\rightarrow$ Word Embeddings
- $\rightarrow$ Word embedding with positional encoding
- $\rightarrow$ Self-attention outputs
- $\rightarrow$ Encoder Sequence outputs layer 1
- $\rightarrow$ Self-attention outputs
- $\rightarrow$ Encoder Sequence outputs layer 2
- $\rightarrow$ ...

Where each encoder layer consists of:

- <mark>Multi-head attention</mark>
- <mark>Add + normalisation</mark> ($LayerNorm(x + Sublayer(x))$)
- <mark>Feed Forward NN</mark> ($FFN(x) = max(0, xW_1 + b_1)W_2+b_2$)
- Add + normalisation

### <mark>Decoder</mark>

This follows the pattern:

- Word embedding with positional encoding
- $\rightarrow$ Self-attention outputs
- $\rightarrow$ Cross-attention outputs
- $\rightarrow$ Decoder Sequence outputs layer 1
- $\rightarrow$ Self-attention outputs
- $\rightarrow$ Cross-attention outputs
- $\rightarrow$ Decoder Sequence outputs layer 2
- $\rightarrow$ ...

We then apply <mark>softmax</mark> at the end to do <mark>language generation</mark>

### <mark>Label Smoothing</mark>

This starts to <mark>penalise the model</mark> if it gets <mark>very confident</mark> about a given choice

$H(y,p) = \sum\limits_{k=1}^K -y_k log(p_k)$, where $y_k^{LS} = y_k(1-\alpha) + \frac{\alpha}{K}$

This <mark>hurts perplexity</mark>, as the model learns to be <mark>more unsure</mark>, but <mark>improves accuracy and BLEU score</mark>

Generally we use $\alpha = 0.1$

### Training Optimisations

The optimisation function usually used is <mark>Adam</mark>

It has a <mark>linear warmup of 4000 steps</mark> - the learning rate is increased from 0 to $1^-3$ very slowly

An alternative is to have the LayerNorm before the residual connection - this doesn't get better results, just a faster performance

## <mark>BERT</mark>

Bidirectional Encoder Representations from Transformers

It only uses the <mark>encoder part of a transformer</mark>

It's used for language representation <mark>pretraining + finetuning</mark>

It reuses the core ideas of:

- <mark>Contextualised embeddings</mark>
- <mark>Semi-supervised learning</mark>
  - <mark>Pretrain on unlabelled data</mark> to learn a <mark>language system</mark>
  - <mark>Finetune on labelled data</mark> to learn <mark>language semantics</mark>

### Input Embeddings

- <mark>Token Embeddings:</mark> General word embeddings
- <mark>Segment Embeddings:</mark> Distinguishing the segments from different sentences (index 0 and index 1)
- <mark>Position Embeddings:</mark> Learnable position embedding (different from the encodings of transformer - learned during training, not sinusoidal, and has limit on max input size - position limit)

The aim of BERT is to have <mark>good representation</mark>, not good sequence generation

### <mark>Masked Language Model</mark> (MLM)

This is where <mark>some of the input words to the encoder are masked</mark>, and the task of the <mark>transformer encoder</mark> is to <mark>generate them</mark>

A <mark>`[CLS]`</mark> token is inserted at the beginning of each sentence

<mark>15% of the input words</mark> are <mark>masked out</mark>, and then these are predicted

<mark>Less masking</mark> means the <mark>cost of training increases</mark>, as we need more training data

<mark>More masking</mark> means we <mark>don't gave enough context</mark>, and therefore we ate still underfitting

With a <mark>`[MASK]`</mark>, we either:

- 80% of the time, replace with <mark>`[MASK]`</mark>
- 10% of the time, replace with a <mark>random word</mark>
- 10% of the time, keep the <mark>same</mark>

This adds <mark>noise/dropout</mark> and makes it more general, preventing overfitting

### <mark>Next Sentence Prediction</mark> (NSP)

- Intuition: recognise <mark>paragraph-level discourse coherence</mark>
- No labelled data required
- Predict whether sentence B is actual sentence that <mark>proceeds sentence A</mark> (50% for training), or a <mark>random sentence</mark> (50% for training)
- `[CLS]` is used as the representation for sequence level classification finetuning
- Inspired by skip-thought vectors
- This takes in two sentences separated by a `[SEP]` token
- The first sentence has segment id 0, the second one 1
- The position embeddings increase sequentially

### <mark>Pretraining</mark>

The objective is MLM and NSP

It's rather costly with a big amount of data, typically days

### Finetuning

<mark>Sequence Level Classification</mark>

- Single Sequence
- Paired Sequences (with `[SEP]` token)
- Produces a <mark>single class</mark> for the whole sequence/sequence pair

<mark>Token Level Classification</mark>

- Single Sequence
- Paired Sequences (e.g. reading comprehension)
- Produces a <mark>label for each input token</mark>

There are minimal changes made to the BERT model

Plug in the <mark>task-specific inputs and outputs</mark>, then replace the <mark>ML and NSP heads</mark> with <mark>corresponding classification layer</mark>

Most hyper-parameters stay the same, except learning rate, batch size etc...

Fine tune all the parameters end-to-end

## Multilingual Transformers

These are models that understand all languages

There are two main types:

- <mark>Word-piece</mark>
  - Likelihood-based BPE + Unigram
  - E.g.: `['Machine', 'Learn', '##ning', 'makes', 'your', 'day']`
- <mark>Sentence-piece</mark>
  - Likelihood-based BPE + Unigram + Whitespace
  - Works for languages not space segmented (language agnostic)
  - E.g.: `['_Machine', '_Learn', 'ning', '_makes', '_your', '_day']

Some key points:

- The <mark>larger the vocabulary</mark> the better performance
- The <mark>larger the model</mark> the better the performance
- The <mark>larger the corpus</mark> the better the performance
- The <mark>larger the clusters</mark> of GPUs/TPUs the better the performance
