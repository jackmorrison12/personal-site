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

- MLP based-models
- No recurrence
- State-of-the-art sequence-to-sequence model
- Enables massive pre-training

There are multiple types of teansformer:

1. Self-attention
2. Positional Encoding
3. Encoder-Decoder Structure

## What is Attention?

Attention is essentially an additional NN to help learn a better representation

It allows for better back-propagation, and is especially useful on longer sentences

No matter the size of the context, it will be summed to an equal-size vector - it doesn't need to change the NN structure

An inductive bias allows a learning algorithm to prioritise one solution over another, independent of the observed data

### Self-Attention

This is an attention mechanism, exploiting relational context information by attending queries to different positions among the same context

$Attention(Q,K,V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$

We take the key and the query, take the product of this, then so the softmax, and then do the weighted sum with the vale in order to get the sequence representation

### Multi-Head Self Attention

$MultiHead(Q,K,V) = Concat(head_1,...,head_h)W^O$ where $head_i = Attention(QK_i^Q, KW_i^K, VW_i^V)$

We expect different head captures different relational bias from a different perspective

## Positional Encoding

The senf-attention models have no sense of position/order for each word

- Discrete Positional Embedding: \[0,1,2,...,512\] (up to a limit)
  - No - can't scale up over limit
- Normalised to a unit: \[0,1\]
  - No - Cannot identify the number of words
- Sinusoidal functions:
  - YES!
  - Unique for each time step
  - Relative positions are invariant for different lengths
  - Scale up to unseen words

$PE_{(pos, 2i)} = sin(pos/10000^{2i/d_{model}})$

$PE_{(pos, 2i+1)} = cos(pos/10000^{2i/d_{model}})$

The target $PE_{pos+k}$ can be represented as a linear function of $PE_{pos}$

$PE_{pos+k}$ can be represented as a linear function of $PE_{pos}$

$PE_{1+2} = F_2(PE_1)$

$PE_{8+2} = F_2(PE_8)$

$f$ is similar to a rotation matrix

$\begin{bmatrix}cos(\lambda_mk)& sin(\lambda_mk) \\ -sin(\lambda_mk)& cos(\lambda_mk)\end{bmatrix} \begin{bmatrix}sin(\lambda_mt) \\cos(\lambda_mt)\end{bmatrix} =\begin{bmatrix}sin(\lambda_m(t+k)) \\cos(\lambda_m(t+k))\end{bmatrix} $

This represents $f(PE_t) = PE_{t+k}$

## Encoder-Decoder Structure

### Encoder

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

- Multi-head attention
- Add + normalisation ($LayerNorm(x + Sublayer(x))$)
- Feed Forward NN ($FFN(x) = max(0, xW_1 + b_1)W_2+b_2$)
- Add + normalisation

### Decoder

This follows the pattern:

- Word embedding with positional encoding
- $\rightarrow$ Self-attention outputs
- $\rightarrow$ Cross-attention outputs
- $\rightarrow$ Decoder Sequence outputs layer 1
- $\rightarrow$ Self-attention outputa
- $\rightarrow$ Cross-attention outputs
- $\rightarrow$ Decoder Sequence outputs layer 2
- $\rightarrow$ ...

We then apply softmax at the end to do language generation

### Label Smoothing

This starts to penalise the model if it gets very confident about a given choice

$H(y,p) = \sum\limits_{k=1}^K -y_k log(p_k)$, where $y_k^{LS} = y_k(1-\alpha) + \frac{\alpha}{K}$

This hurts perplexity, as the model learns to be more unsure, but improves accuracy and BLEU score

Generally we use $\alpha = 0.1$

### Training Optimisations

The optimisation function usually used is Adam

It has a linear warmup of 4000 steps - the learning rate is increased from 0 to $1^-3$ very slowly

An alternative is to have the LayerNorm before the residual connection - this doesn't get better results, just a faster performance

## BERT

Bidirectional Encoder Representations from Transformers

It only uses the encoder part of a transformer

It's used for language representation pretraining + finetuning

It reuses the core ideas of:

- Contextualised embeddings
- Semi-supervised learning
  - Pretrain on unlabelled data to learn a language system
  - Finetune on labelled data to learn language semantics

### Input Embeddings

- Token Embeddings: General word embeddings
- Segment Embeddings: Distinguishing the segments from different sentences (index 0 and index 1)
- Position Embeddings: Learnable position embedding (different from the encodings of transformer - learned during training, not sinusoidal, and has limit on max input size - position limit)

The aim of BERT is to have good representation, not good sequence generation

### Masked Language Model (MLM)

This is where some of the input words to the encoder are masked, and the task of the transformer encoder is to generate them

A `[CLS]` token is inserted at the beginning of each sentence

15% of the input words are masked out, and then these are predicted

Less masking means the cost of training increases, as we need more training data

More masking means we don't gave enough context, and therefore we ate still underfitting

With a `[MASK]`, we either:

- 80% of the time, replace with `[MASK]`
- 10% of the time, replace with a random word
- 10% of the time, keep the same

This adds noise/dropout and makes it more general, preventing overfitting

### Next Sentence Prediction (NSP)

- Intuition: recognise paragraph-level discourse coherence
- No labelled data required
- Predict whether sentence B is actual sentence that proceeds sentence A (50% for training), or a random sentence (50% for training)
- `[CLS]` is used as the representation for sequence level classification finetuning
- Inspired by skip-thought vectors
- This takes in two sentences separated by a `[SEP]` token
- The first sentence has segment id 0, the second one 1
- The position embeddings increase sequentially

### Pretraining

The objective is MLM and NSP

It's rather costly with a big amount of data, typically days

### Finetuning

Sequence Level Classification

- Single Sequence
- Paired Sequences (with `[SEP]` token)
- Produces a single class for the whole sequence/sequence pair

Token Level Classification

- Single Sequence
- Paired Sequences (e.g. reading comprehension)
- Produces a label for each input token

There are minimal changes made to the BERT model

Plug in the task-specific inputs and outputs, then replace the ML and NSP heads with corresponding classification layer

Most hyper-parameters stay the same, except learning rate, batch size etc...

Fine tune all the parameters end-to-end

## Multilingual Transformers

These are models that understand all languages

There are two main types:

- Word-piece
  - Likelihood-based BPE + Unigram
  - E.g.: `['Machine', 'Learn', '##ning', 'makes', 'your', 'day']`
- Sentence-piece
  - Likelihood-based BPE + Unigram + Whitespace
  - Works for languages not space segmented (language agnostic)
  - E.g.: `['_Machine', '_Learn', 'ning', '_makes', '_your', '_day']

Some key points:

- The larger the vocabulary the better performance
- The larger the model the better the performance
- The larger the corpus the better the performance
- The larger the clusters of GPUs/TPUs the better the performance
