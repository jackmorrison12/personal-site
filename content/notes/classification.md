---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Classification
slug: classification
topic: 3
hidden: false
tags:
  - Classification
---

## What is classification?

It's about understanding things around us, grouping things bu some of their shared properties

Some examples are:

- Sentiment analysis
- Fake news/deception detection
- Authorship detection
- Offensive language identification
- Topic classification

Sentiment analysis is the evaluation of the writer attitude towards something

An example is customer satisfaction

There can be different levels:

- Binary: positive/negative
- 3-way: positive/negative/neutral
- More granular: happiness, anger, sadness...

Product reviews are good training data for this, as they usually have a labelled review out of 5

## Naive Bayes

- Input: a document $x \in X$
- Output: an output class $y \in Y$
- Goal: predict $\hat{y} = argmax_y P(y|x)$, where $y$ is a class and $x$ is a feature
  - Supervised machine learning setting
  - Training corpus: labelled instances ($x,y$)

Raw input is transformed into a numerical representation, e.g. each input $x$ is represented by a feature vector $[x_1, x_2, ... , x_I]$

It could also be words themselves (bag of words) or some kind of feature engineering

A Naive Bayes classifier then uses Bayes rule to calculate $P(y|x) = \frac{P(x|y)P(y)}{P(x)}$, where:

- $P(y|x)$ = posterior
- $P(x|y)$ = likelihood
- $P(y)$ = prior
- $P(x)$ = evidence

Since $P(x)$ ist just normalisation, and we are doing an argmax:

$\hat{y} = argmax_yP(y|x) = argmax_yP(x|y)P(y)$

Since $x$ is a set of features, we need to decompose it

$\hat{y} = argmax_yP(y|x) = argmax_yP(x_1, x_2, ... , x_I|y)P(y)$

Using the Naive bayes independence assumptionL

$P(x_1, x_2, ... , x_I|y) = P(x_1|y) \cdot P(x_2|y) \cdot ... \cdot P(x_I|y)$

Therefore

$\hat{y} = argmax_y P(y) \prod\limits_{i=1}^I P(x_i|y)$

In practice, it is count based $P(y) = \frac{N_y}{N_x}$

$P(x_i|y) = \frac{\mathsf{count}(x_i, y)}{\sum\limits_{x \in V} \mathsf{count}(x,y)}$

However, you need to do add-one smoothing in order to avoid probabilities of 0, sunce when we multiply the probabilities together this would result in a 0 product

$P(x_i|y) = \frac{\mathsf{count}(x_i, y) + 1}{\sum\limits_{x \in V} (\mathsf{count}(x,y) + 1)} = \frac{\mathsf{count}(x_i, y) + 1}{(\sum\limits_{x \in V} \mathsf{count}(x,y)) + |V|}$, where $V$ is the vocabulary across classes

Some problems with this are:

- All features are equally important
- Conditional independence assumption
- Context not taken into account
- New words not seen at training cannot be used

## Logistic Regression

Generative models: given an observation, the model returns the class most likely to have generated the observation (like Naive Bayes)

Discriminative models: directly learn what features from the input are most useful to discriminate between the different classes (like logistic regression)

Logistic regression discriminated between classes

It solves $\hat{y} = argmax_yP(y|x) $ by learning weights $w_i$ for features $x_i$

Let our logistic function be $y(x)$ = $g(z)$ = $\frac{1}{1 + e^{-z}}$

$z = w \cdot x + b$

$w$ are the weights, and represent how important that input feature is to the classification decision

$P(y=1) = \frac{1}{1 + e^{-(w \cdot x+b)}}$

We make a decision by thresholding on 0.5, so if $P(y=1|x) > 0.5$, then $\hat{y} = 1$, else it is 0

To learn the weights during training, we:

1. Measure the distance between true and predicted labels using a loss function (usually cross entropy)
2. Use an optimisation algorithm to minimise this function (usually gradient descent)

Cross entropy loss: $H(P,Q) = \sum\limits_iP(y_i) log Q(y_i)$

Where $P(y_i)$ is the true probability, and $Q(y_i)$ is our predicted probability

We can use the softmax function to get a probability distribution over multiple classes:

$y = g(z_i) = \frac{e^{z_i}}{\sum\limits_{j=1}^k e^{z_j}}$, where $1 \leq i \leq k$

The problem addressed is that not all features are equally important any more, but the other problems from Naive Bayes remain

## Neural Networks

A neural unit is written $ z = w \cdot x + b = \sum\limits_{i=0}^I w_i x_i + b$

This is similar to logistic regression, but the way we learn weights is different

It also has a non-linear activation function, so $y = g(z)$

A feed-forward neural network has multiple hidden layers

The input is a ohe-hot representation of words, automatically learnt dense feature representation, or dense representations

To pass in a sentence rather than just a word, we can take the average of each feature column for every word, and therefore would have the same size input for every sentence (just 1 x embedding dim)

However, this would mean some sentences with words in different orders could have the same representation and not the same meaning

A better solution is to fix the dimensionality, either to:

- Longest input length - padding needed by adding a reserved value to missing positions
- Shortest input length - need to cut longer sequences, which may incur information loss

Neural networks should be used because:

- Automatically learned features
- Non-linearity
- Unique to NNS: multiple parameters and functions, flexibility to fit highly complex data (but require more data for proper training)

However, they don't fix any more issues than logistic regression did

## Convolutional Neural Networks

In a nutshell, a CNN is:

- A NN composed of a series of convolutional layers, pooling layers and fully connected layers
- Convolutional layers detect important patterns in input
- Pooling layers reduce dimensionality of features, transform then into a fixed-size
- Fully connected layers train weights of leaned representation for the specific task

The inputs are tokens, which is a matrix where each row represents a token through its embedding / one-hot vector

The intuition is that:

- Input sequence of words represented by word embedding
- Convolutional layers help us learn combinations of words (n-grams) that are important (filters)
- Pooling layers want the n-grams to have the same representation regardless of where they are in the sentence
- Filters (kernels) are sliding windows over full rows (words) in 1D, with width of embedding gim, and height of window size
- There are multiple filters for the same size, where each focuses on a particular n-gram
- Typically a nonlinear layer is applied after each convolutional layer
- Pooling layers subsample from the output of each filter, by max pooling
  - Output is a single number for each filter
  - Output dim is independent of input dim
  - Position of n-gram in sentence is not important, only presence
  - Also works as dim reduction

This now addresses the following problems:

- Not all features are equally important any more
- Conditional independence assumption is somewhat lifted (no dependence between words not in same n-gram)
- Context somewhat taken into account

However, new words not seen at training can still not be used

## Char-based CNNs

Here, all words, including the unknown, share the same characters/subwords

Text is represented as a sequence of characters or subwords

They give a better representation for misspelled words, and languages sharing the same alphabet

This addresses the issue of new words not seen in training being used

## Recurrent Neural Networks (RNNs)

These take in natural language data as sequences

The value of a unit depends on its own previous output as input

Usually the last hidden state is the input to the output layer
