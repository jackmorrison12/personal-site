---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Introduction to NLP
slug: intro
topic: 1
hidden: false
tags:
  - Intro
---

## What is NLP?

NLP is the <mark>processing of natural language by computers</mark> for a task

It combines, computing, cognitive science, linguistics and AI (specifically ML)

The goal is to have systems which <mark>understand natural language</mark>, can execute requested tasks, and <mark>produce natural language</mark>

It's split into <mark>natural language understanding</mark> (NLU) and <mark>natural language generation</mark> (NLG)

## Challenges

Natural language is complex, there is <mark>ambiguity</mark>

An example is if someone says _"Can you bring me that file?"_, they could mean a document or a tool

Another example is if someone said _"I saw the boy with a telescope"_, they could mean the boy had a telescope, or they used a telescope to see him

## Building Blocks

The building blocks of NLP are:

- <mark>Lexicon</mark> (words: segmentation, normalisation, morphology)
- <mark>Syntax</mark> (sentence structure)
- <mark>Semantics</mark> (meaning of words and sentences)
- <mark>Discourse</mark> (meaning of a text, relationship between sentences)
- <mark>Pragmatics</mark> (intentions, commands)

### Lexicon

A <mark>lexicon is made up of words</mark>... but what is a 'word', and what is it composed of?

#### Word Segmentaion

This is things like <mark>tokenisation and decompounding</mark>, for example:

- hi, $\rightarrow$ \<hi> \<,>

- sentence-level $\rightarrow$ \<sentence> \<level>

- Wienerschnitzel $\rightarrow$ \<Wiener> \<schnitzel>

#### Word Normalisation

This is things like <mark>capitalisation, acronyms, and spelling variants</mark>, for example:

- Cat $\rightarrow$ cat

- Turkey $\rightarrow$ turkey

- USA and U.S.A and U S A $\rightarrow$ USA

- chequebook and cheque book $\rightarrow$ cheque book

#### Lemmatisation

This is where a word is reduced to its <mark>base form</mark>, for example:

- ate, eating $\rightarrow$ eat

- girls $\rightarrow$ girl

- connected $\rightarrow$ connect

- worries, worries $\rightarrow$ worry

#### Stemming

This is where you <mark>reduce to the root</mark>, which is not always a valid word, for example:

- connected, connecting, connection, connections $\rightarrow$ connect

- worried, worryingly, worries, worrying $\rightarrow$ worr

#### Part-of-speech tagging

This is where you can recognise the <mark>category of a word</mark> such as verb, noun, adjective...

For example:

- girl = noun

- play = verb/noun

- happy = adjective

- happily = adverb

- the = determiner

- of = preposition

- they = pronoun

#### Morphological Analysis

This is where you <mark>recognise and can generate word variants</mark>, for example:

- Number/gender/tense:
  - boys = plural of 'boy'
  - heureuse = deminine of 'heureux'
  - plays = third form of verb 'play'
- Affixes:
  - **un**happy
  - happi**ly**
  - **un**happi**ness**
  - John**'s**

### Structure & Syntax

This determines <mark>how words are put together</mark>

It's ruled by the <mark>language's grammar</mark>, for example:

Sentence $\rightarrow$ Noun-phrase Verb-phrase

Noun-phrase $\rightarrow$ Determiner Noun

... and so on

This is then <mark>combined with the lexicon</mark> in order to interpret a language, where the lexicon maps non-terminals such as 'Noun' to terminals such as 'puppy'

If a sentence cab be parsed using this grammar, it is a sentence which belongs to the language

### Semantics

This is understanding the <mark>meaning of words in context</mark>

For example, does 'bank' refer to a financial institution or a sloping piece of land?

<mark>Word sense disambiguation</mark> is where, given a word and it's context, the correct meaning can be given to the candidate word

Semantics are not just limited to words, but can have a <mark>compositional meaning over a whole sentence</mark>

<mark>Semantic role labelling</mark> is where a semantic role is assigned to each word in a sentence, and a sentence fails if they cannot be done (essentially making sure the words make sense together)

For example:

[The boy] kicked [the ball]

Here, role of the boy is 'agent', and of the ball is 'theme'

<mark>Semantic features</mark> can also be assigned, for example 'animated', and then assigned to these roles, for example the agent of the verb kick has to be animated (able to move)

### Discourse

This is how <mark>separate sentences relate to each other</mark>

It looks at references and relationships within and across sentences

### Pragmatics

This looks at the <mark>intent of the text</mark>

For example, if someone asks "Do you have the time?", the intended answer is the time, not "yes/no", which is technically the answer to the question

## Applications

There are many applications of NLP in the real world, such as <mark>sentiment analysis and machine translation</mark>

For these, we don't need every component discussed above for them all:

- <mark>Sentiment analysis</mark>: We need basic pre-processing, such as tokenisation, stop word removal and lemmatisation
- <mark>Question answering</mark>: We need basic pre-processing plus parsing, and maybe semantic role labelling
- <mark>Dialogue systems</mark>: We need them all, and more!

## Why machine learning?

Machine learning is currently at the forefront of NLP research

This is because <mark>creation and maintenance of linguistic rules</mark> is often <mark>infeasible or impractical</mark>, due to the number of rules, contradictions, and the cost and need for experts to do this

Therefore, <mark>feature engineering & examples</mark> are used instead

Data and examples can be abundant for certain applications and languages, such as human translations or movie reviews

### Deep Learning

Deep learning specifically provides a very <mark>flexible, (semi-)universal learnable framework</mark> for <mark>representing linguistic information</mark>

It can also learn in <mark>supervised and unsupervised</mark> fashions

It's used as feature design is hard and not always effective, as it may be overspecified or incomplete

Deep learning can use either sparse or dense features:

- <mark>One-hot vectors</mark> (sparse)
  - Each feature has its own dimension
  - Dimensionality of vector = number of distinct features
  - Features are independent of each other
- <mark>Dense vectors</mark>
  - Each feature is a d-dimensional vector
  - Similar features will have similar vectors
  - Better generalisation

We use deep learning as it can <mark>learn representations from raw input</mark>

It can also learn multiple levels of representations

Some examples are feed-forward networks, which are already powerful, such as MLP and CNN

The key feature is <mark>non-linearity</mark>

It can be used for classification, regression or structured prediction

Other types of networks, such as RNNs, are better for other applications such as encoding or decoding sequences

Deep learning was feasible due to:

- Large amounts of <mark>training data</mark>
- <mark>Faster machines</mark> / multicore CPU/GPUs
- New architectures and algorithms
- Better regularisation and optimisation methods
