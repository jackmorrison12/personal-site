---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Word Representation
slug: word-representation
topic: 2
hidden: false
tags:
  - Word Representation
---

## NLP Input

<mark>Words are the basic input</mark> for most NLP applications

However this depends - it could also be <mark>characters</mark>, especially in languages like chinese, or smaller units such as <mark>lemmas, roots or subword units</mark>

## How do we represent words?

First, we do <mark>pre-processing</mark>

This could be:

- <mark>Tokenisation</mark> (splitting words from punctuation)
- <mark>Punctuation removal</mark> (removing punctuation all together)
- <mark>Normalisation</mark> (conflate token variants to the same form, e.g. removing capitalisation)
- <mark>Stop word removal</mark> (remove words which don't carry any meaning, e.g. 'the')
- <mark>Rare words removal</mark> (remove words for which sufficient statistics cannot be computed, e.g. below a certain count threshold)
- <mark>Lemmatisation</mark> (reducing words to basic form)
- <mark>Stemming</mark> (reducing words to the root/stem)
- <mark>Sub-word unit</mark> conversion (reduce words to subparts based on frequency, handles rare words/reduces vocab size)

### <mark>Byte Pair Encoding</mark>

This is a type of sub-word unit conversion, following the algorithm:

```
1. Count frequency of tokens in token vocabulary Vt
2. Segment tokens into characters
3. Add end of token marker - new vocabulary Vc
4. Merge 2 most frequent characters and update Vc
5. Repeat step 4 for a max number of merging operations
```

An example can be found [here](https://leimao.github.io/blog/Byte-Pair-Encoding/)

The algorithm above is done at training time on a vocabulary

When you want to represent a word at test time, you do the following:

```
1. Get all symbol bigrams in the word
2. Find a symbol pair that appeared the first among the symbol merges (Vc)
3. Apply the merge on the word
4. Repeat from step 2
```

### Preprocessing

Preprocessing is very important

It's where the <mark>linguistic insights</mark> start in NLP

The order of the steps does usually matter, for example you need to normalise, then do BPE

## Ways of representing words

Once pre-processing is done, there are <mark>many ways of representing words</mark>, including:

- <mark>Words themselves</mark> (Bag-of-Words)
- Mapping words to <mark>concepts</mark> lexical database
- <mark>Features</mark> of words
- By <mark>co-occurrence</mark> with other words - count-based
- By co-occurrence with other words - predication-based (word embeddings)

### Bag-of-Words (BOW)

This is where <mark>sentences are represented by words themselves</mark>

For example, the following two sentences would be represented as follows:

1. The cat chased the mouse
2. The kitten ran after the rat

|     | ... | after | cat | chase | kitten | mouse | rat | run | the | ... |
| --- | --- | ----- | --- | ----- | ------ | ----- | --- | --- | --- | --- |
| 1.  | 0   | 0     | 1   | 1     | 0      | 1     | 0   | 0   | 1   | 0   |
| 2.  | 0   | 1     | 0   | 0     | 1      | 0     | 1   | 1   | 1   | 0   |

The table has a 1 if the word is present, and a 0 if it is not

This is a binary vector, you could also use a frequency or TF-IDF vector

It is very <mark>sparse</mark>

It <mark>cannot model relatedness</mark> between words

### Mapping of words to concepts

This is where <mark>words are mapped to a concept</mark>, so the following example would use the mapping:

- Cat & kitten $\rightarrow$ feline mammal
- Mouse & rat $\rightarrow$ rodent mammal

To become:

|     | ... | after | feline | chase | rodent | run | the | ... |
| --- | --- | ----- | ------ | ----- | ------ | --- | --- | --- |
| 1.  | 0   | 0     | 1      | 1     | 1      | 0   | 1   | 0   |
| 2.  | 0   | 1     | 1      | 0     | 1      | 1   | 1   | 0   |

This is a smaller vector, and <mark>better encodes similarity</mark>

However, some issues are:

- It <mark>misses nuances</mark> and new meanings (e.g. is a mouse = rat?)
- <mark>Disambiguation</mark> is hard (does mouse go to rodent or computer device?)
- Databases don't exist for most languages

### Features extracted from words

This is an example which could be used for sentiment analysis

The feature may be the percentage of positive and negative words

For example, the following sentences would have the following representation:

1. **Vivid** and **sharp** display, **amazing** camera, **easy** to use with one hand, extremely **fast**, and more **responsive** than any other phone I have used
2. **Unnecessary**, don't upgrade if you're thinking about it, too **expensive**

|     | % positive | % negative |
| --- | ---------- | ---------- |
| 1.  | 6          | 0          |
| 2.  | 0          | 2          |

This <mark>requires domain knowledge</mark> (e.g. which words are positive, which are negative), and is also <mark>task specific</mark>

## Co-occurrence (distributional hypothesis)

A <mark>word's meaning is given</mark> by the <mark>words that frequently appear with it</mark> in corpora

This is moving from <mark>discrete to continuous</mark> representation

<mark>Vector space models</mark> represent words in a continuous vector space where semantically similar words are mapped to nearby points

The approaches are:

- <mark>Count based</mark> (co-occurrence matrix)
- <mark>Prediction based</mark> (word2vec, GLOVE, BERT)

### Co-occurrence matrix (count-based)

Define a word by <mark>words it co-occurs with</mark> in the corpus

Using the following 5 sentences as an example:

- Cats eat mice
- Dogs eat food
- Trees are green
- Kittens eat mice
- Puppies eat food

We can represent a word by its context:

|        | cat | eat | mouse | kitten | dog | food | puppy | tree | are | green |
| ------ | --- | --- | ----- | ------ | --- | ---- | ----- | ---- | --- | ----- |
| cat    | -   | 1   | 1     | 0      | 0   | 0    | 0     | 0    | 0   | 0     |
| eat    | 1   | -   | 1     | 1      | 1   | 1    | 1     | 0    | 0   | 0     |
| mouse  | 1   | 1   | -     | 1      | 0   | 0    | 0     | 0    | 0   | 0     |
| kitten | 0   | 1   | 1     | -      | 0   | 0    | 0     | 0    | 0   | 0     |
| dog    | 0   | 1   | 0     | 0      | -   | 1    | 0     | 0    | 0   | 0     |
| food   | 0   | 1   | 0     | 0      | 1   | -    | 1     | 0    | 0   | 0     |
| puppy  | 0   | 1   | 0     | 0      | 0   | 1    | -     | 0    | 0   | 0     |
| tree   | 0   | 0   | 0     | 0      | 0   | 0    | 0     | -    | 1   | 1     |
| are    | 0   | 0   | 0     | 0      | 0   | 0    | 0     | 1    | -   | 1     |
| green  | -   | -   | -     | -      | -   | -    | -     | 1    | 1   | -     |

This is a <mark>symmetric matrix</mark>

- We should <mark>remove stop words</mark>
- We can also use frequency or proportion of times, instead of just binary
- Can weight terms by TF-IDF
- Allows for some <mark>notion of similarity</mark>, e.g. $L_2$ norm : $\sqrt{\sum_{i=1}^n (q_i - d_i)^2}$

If we calculate the <mark>$L_2$ norm</mark> on the words cat and kitten, we get 1.41, whereas cat and dog get 2.65 (smaller = closer)

<mark>Cosine distance</mark> is another way of measuring distance:

$\frac{\sum_{i=1}^n q_id_i}{\sqrt{\sum_{i=1}^nd^2}\sqrt{\sum_{i=1}^n q^2}}$

<mark>TF-IDF</mark> is a common preprocessing step

It where <mark>query terms are weighted higher</mark> if they <mark>ccur in certain documents</mark> but <mark>not in others</mark>

For example, the word 'the' isn't very telling, as it occurs in most sentences, and therefore it's downweighted

$TF-IDF_{w,d,D} = TF_{w,d}IDF_{w,D}$ (frequency of the word in the document)

Where:

$TF_{w,d} = freq_{w,d}$ and $IDF_{w,D} = log \frac{|D|}{df_w}$ (size of collection over number of documents in the collection which have that word)

### Prediction based - Word Embeddings (word2vec)

However, one problem with this is that it is <mark>still very large and very sparse</mark>

Therefore, the solution is to <mark>learn word representation from data</mark>, and <mark>embed them in a smaller space</mark>

- Implicitly model similarity between words in corpora
- Already start with <mark>lower dimensionality space</mark>
- Instead of counting co-occurrences, <mark>predict context words</mark> in context
- Computationally efficient
- Adding new words in the model <mark>scales with corpus size</mark>

This is the core idea of deep learning

There are two common models:

- Continuous Bag-of-Words (<mark>CBOW</mark>)
  - This predicts the <mark>target word $w_t$ from context words</mark>
  - $w_{t-j}$ ... $w_{t-2}$ $w_{t-1}$ ? $w_{t+1}$ $w_{t+1}$ ... $w_{t+j}$
- <mark>Skip-gram model</mark>
  - This predicts the <mark>context words from the target word</mark>
  - ? ? ? $w_t$ ? ? ?

Focusing on skip-gram models, in a nutshell:

- They're a <mark>1 hidden layer</mark> neural network
- w(t) is the target words, given as <mark>input as a one-hot vector</mark>
- One hidden layer performs the <mark>dot product</mark> between the <mark>weight matrix W and the input vector w(t)</mark>, no activation function is used
- The result of the dot product at the hidden later is passed to the <mark>output layer</mark>, which computer the dot product between the output vector of the hidden layer and the weight matrix of the output later (W')
- The <mark>softmax activation function</mark> is applied to compute the probability of any vocabulary word appearing in the context of w(t)
- At training time, <mark>output is a one-hot vector</mark> for each true context word

#### Training

During training, we use <mark>pairs of corresponding words</mark> to create W and W'

We get these from <mark>running a window</mark> across input sentences, and picking words which are within that window of each word

For example, using the sentence "the quick brown fox jumps over the lazy dog" with window size 2, our first run would give (the, quick) and (the, brown)

The goal is to <mark>find word representation that are useful for predicting context words</mark> $w_{t+j}$ given a word $w_t$ by maximising the average log probability for context window $c$

This is done using <mark>stochastic gradient descent</mark> with cross entropy as the loss function

The <mark>hidden later</mark> will have a <mark>set dimension</mark>, say 300, and a vocab of, say 10K

The <mark>embedding matrix</mark> is the <mark>weight matrix</mark> with 10k rows (one per word in V) and 300 columns (one per hidden column)

The <mark>lookup table</mark> can be generated by <mark>multiplying a 1x10000 one-hot vector</mark> by a <mark>10Kx300 matrix</mark>, aka selecting the matrix row for the column with 1

However, a caveat is that in order to compute a <mark>single forward pass</mark> of the model, you need to <mark>sum across the entire corpus vocab</mark>

This is <mark>prohibitively expensive</mark> on large vocabs, e.g. for 300 dims and 10k words, this is 3 million weights in each hidden layer and output layer

Therefore, <mark>approximation is used</mark>

This is done by <mark>removing the softmax</mark>, and using a binary classification objective (<mark>logistic regression</mark>) to discriminate real target words ($w_t$) from other noise words

So for example, using the sentence from before, to predict 'quick' from 'the', we select k noisy words which aren't in the context window of 'the'

Say k=1, and the noisy word is 'sheep'

We'd compute the loss function using both of these, so that the objective at this timestep is now:

$log (Q_\Theta (D=1|the, quick)) + log(Q_\Theta(D=0 | the, sheep))$

<mark>Negative sampling</mark> is done randomly or by frequency, usually with about 5-20 negative words on small datasets, and only 2-5 needed on larger ones

This speeds it up, since for the model we had of 300x10k weight matrix, we need up update weights for the positive word (quick) plus 5 other words we want the output to be 0 for

This is 6 output neurons, so so 6x300=1800 weight values in total, much less than the 3M before

#### Testing

After training, we <mark>remove the output later</mark>, and at test time we take the one-hot vector of a word, and its product with W is the word embedding of the input word

<mark>W</mark> is the <mark>word embedding matrix</mark>, <mark>W'</mark> is the <mark>context matrix</mark>

#### What these vectors capture

<mark>Relationships</mark>, such as "man is to woman as uncle is to aunt"

<mark>Plurals</mark>, such as "apples is to apple as cars is to car"

Therefore, you can do <mark>arithmetic</mark>, such as: king - man + woman = queen

#### Other skip-gram tricks

- You can also treat <mark>common word pairs or phrases as single "words"</mark>
- Subsampling frequent words to decrease the number of training examples
- Using hierarchical softmax

### Other types of word embeddings

- CBOW
- GLOVE
- Fasttext
- Contextualised word embeddings
  - ELMo
  - ULMFIT
  - BERT
  - RoBERTa

Having a quick look at one of there, <mark>ELMo</mark>, context matters in the embedding of a word

- Instead of a fixed embedding for each word, it <mark>looks at the entire sentence</mark> before assigning each word an embedding
- It uses a pre-trained, 2-layer, bi-directional, RNN-based language model that predicts the next word given
- It <mark>extracts the hidden state</mark> of each layer for the input sequence of words
- It then computes a <mark>weighted sum</mark> of those hidden states <mark>to obtain an embedding</mark> for each word
- The <mark>weight</mark> of each hidden state is <mark>task-dependent</mark>, and is learned

<mark>BERT</mark> was inspired from this, but is based on transformers rather than RNNs, so have a more powerful use of context

- Has an <mark>encoder</mark> than reads the entire sentence at once
- Some % of the words are <mark>masked</mark>, then it's tasked with <mark>predicting them based on context</mark>
