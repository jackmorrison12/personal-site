---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: nlp
title: Topic Models
slug: topic-models
topic: 8
hidden: false
tags:
  - Topic Models
---

## Probabilistic Topic Models

Documents can be preresented in many ways:

- High Dimensional
  - Bag-of-words
  - Re-weighted features (normalised frequencies, TF-IDF, L2)
- Low Dimensional
  - Document embedding (learned from LM)
  - Skip-gram/CBoW
  - GloVe
  - BERT

Topic models are a way to go from a high dimensional space, such as vocabulary size, to a low dimensional space

We want the low dimensional space to be interpretable

We don't want supervised learning - we use unsupervised learning to find layers between the document and the topics

For example, we may split a document into topics such as "Genetics", "Evolution", "Disease" and "Computers" - these tags are chosen based on the words in each topic

### LSA

Latent Semantic Analysis is not a topic model, but it maps high dimensional document vector space representations to lower dimensional representations

- Dimensionality Reduction
- Assume words with similar meaning will occur in similar documents (co-occurrence)
- Reveal semantic relations between documents
  - Compute document similarity by the inner product in the latent semantic space
  - Compute word similarity by the inner product in the latent semantic space
- Apply SVD for inference

Given the document-words matrix $D(m*n)$, do the singular decomposition

Similar words/documents map to similar locations in the low dimensional space

This is hard to interpret (the vectors for docs/words)

### PLSA

Probabilistic Latent Semantic Analysis is a latent variable model that maps high dimensional document vector space representation to lower dimensional representation

- Dimensionality Reduction
- PLSA evolved from LSA by adding a sounder probabilistic model
- Models word-document co-occurrences as a mixture of conditionally independent multinomial distributions
  - Words are observed
  - Topics are latent
- Apply EM (Expectation-Maximisation) for inference

Generative distribution:

$p(D,W) = \prod_d\prod_wp(d,w) = \prod_d\prod_wp(d)\sum_zp(w|z)p(z|d)$

Log likelihood:

$L = \sum_d\sum_wlog[p(d)\sum_zp(z|d)p(w|z)]$

$ = \sum_d\sum_wlogp(d)+\sum_d\sum_wlog\sum_zp(z|d)p(w|z)$

The expectation-maximisation algorithm is an iterative methods to find (local) maximum likelihood or maximum a posteriori (MAP) estimated of parameters in statistical models, where the model depends on unobserved latent variables

The E step computes the posterior probabilities of the unobserved latent variable $z$

- Compute posterior probabilities for $z$ (choose the assignments for the latent $z$)
- $p(\hat{z}|w,d) = \frac{p(\hat{z},w,d)}{p(w,d)} = \frac{p(d)p(\hat{z}|d)p(w|\hat{z})}{\sum_zp(d)p(z|d)p(w|z)}$
- The numerator is the multinomials, and the denominator is a normalisation which integrates out all of the topics

The M step uses the knowledge from E to update the parameters using the given posterior probabilities

- This updates parameters using given posterior probabilities by MLE
- Rewrite the objective constraint:
- $L = \sum_d\sum_wn(d,w)\sum_zp(z|w,d)log\ p(d)p(w|z)p(z|d) + \alpha(1-\sum_dp(d)) + \sum_d\beta_d(1-\sum_zp(z|d)) + \sum_z\gamma_z(1-\sum_wp(w|z))$
- Ler $n(d,w)$ is the number of times word $w$ appears in document $d$
- $1-\sum\limits_{w_j}p(w_j|z) = 0 \rightarrow p(w_j|z_t) = \frac{\sum_dn(d,w_j)p(z_t|w_j,d)}{\sum_w\sum_dn(d,w)p(z_t|w,d)}$
- $1-\sum\limits_{z}p(z|d_i) = 0 \rightarrow p(z_t|d_i) = \frac{\sum_wn(d_i,w)p(z_t|w,d_i)}{\sum_w\sum_zn(d_i,w)p(z_t|w,d_i)}$

Strengths:

- Graphical model: easy to extend
- A clear probabilistic interpretation (every topic + word connected by a multinomial distribution)
- EM algorithm is simple

Limitations:

- Difficult to scale up
  - Prone to overfitting
  - Hard to generalise to unseen documents (inference is on collection of documents)
  - Easy to be stuck at local minimum

### LDA

Latent Dirichlet Allocation is a Bayesian version of PLSA, and the document-topic and word-topic distribution are assumed to have a sparse Dirichlet prior

The Dirichlet distribution is an exponential family distribution over the simplex, i.e. positive vectors that sim to one

$p(\theta|\alpha) = \frac{\Gamma(\sum_{k=1}^K\alpha_k)}{\prod_{k=1}^K\Gamma(\alpha_k)}\prod\limits_{k=1}^K\theta_k^{\alpha_k - 1}$

If $\alpha$ is a scalar parameter, i.e. $a = \sum \alpha_k/K$, then:

$p(\theta|\alpha, K) = \frac{\Gamma(K\alpha)}{\Gamma(\alpha)^K}\prod\limits_{k=1}^K\theta_k^{\alpha - 1}$

Dirichlet is conjugate to the multinomial, so given a multinomial observation, the posterior distribution of $\theta$ is a Dirichlet

LDA trades off two goals by the sparse Dirichlet prior

1. For each document, allocate its words to as few topics as possible
2. For each topic, assign high probability to as few terms as possible

LDA typically works better than PLSA because it can generalise to new documents easily

The generative process follows this algorithm:

```
for each topic k in (1,K):
  choose a word distribution ϕk ~ Dirichlet(β)
for each document m in (1,M):
  choose a topic distribution θm ~ Dirichlet(α)
  for each word w_mn in m-th document:
    choose a topic assignment z_mn ~ Multinomial(θm)
    choose a word w_mn ~ Multinomial(ϕz_mn)
```

The joint distribution is therefore:

$p(w,z,\theta,\phi|\alpha,\beta) = \prod_kp(\phi_k|\beta)\prod_m(p(\phi_m|\alpha)\prod_np(z_{m,n}|\theta_m)p(w_{m,n}|\phi_{z_{m,n}}))$

The EM algorithm is not applicable because at the E-step, the posterior probabilities of z is intractable ($\theta$ cannot be integrated out as it is a continuous variable)

If the posterior is intractable, we cna propose a variational distribution to approximate it:

We can use Jensen's inequality on a general case to do this

For LDA, we'd use a variational distribution to approximate the true posterior

To evaluate LDA, we can use:

- Perplexity (normalised log-likelihood)
  - $ppx = exp(-\frac{1}{D}\sum_d^D \frac{1}{N_d}log\ p(d))$
  - This is an evaluation for all of the documents
  - It represents the ability for it to generalise
- Topic Coherence (normalised point-wise mutual information)
  - $w_i, w_j$ are the top-n words in the topic $T$
  - $NPMI(T) = \sum_i\sum_j\frac{log\frac{P(w_i,w_j)}{P(w_i)P(w_j)}}{-log\ P(w_i,w_j)}$
  - The higher the average pairwise similarity between words in $T$, the more coherent the topic is
  - It gives us a measure for the quality of a topic - how expressive it is

## Neural Topic Models


