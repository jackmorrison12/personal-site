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

Documents can be represented in many ways:

- <mark>High Dimensional</mark>
  - <mark>Bag-of-words</mark>
  - Re-weighted features (normalised frequencies, TF-IDF, L2)
- <mark>Low Dimensional</mark>
  - <mark>Document embedding</mark> (learned from LM)
  - Skip-gram/CBoW
  - GloVe
  - BERT

Topic models are a way to go from a <mark>high dimensional space</mark>, such as vocabulary size, to a <mark>low dimensional space</mark>

We want the <mark>low dimensional space</mark> to be <mark>interpretable</mark>

We don't want supervised learning - we use <mark>unsupervised learning</mark> to find layers between the document and the topics

For example, we may split a document into topics such as "Genetics", "Evolution", "Disease" and "Computers" - these tags are chosen based on the <mark>words in each topic</mark>

### <mark>LSA</mark>

Latent Semantic Analysis is not a topic model, but it maps high dimensional document vector space representations to lower dimensional representations

- <mark>Dimensionality Reduction</mark>
- Assume words with <mark>similar meaning</mark> will occur in <mark>similar documents</mark> (co-occurrence)
- Reveal s<mark>emantic relations between documents</mark>
  - Compute <mark>document similarity</mark> by the <mark>inner product</mark> in the <mark>latent semantic space</mark>
  - Compute <mark>word similarity</mark> by the <mark>inner product</mark> in the <mark>latent semantic space</mark>
- Apply <mark>SVD</mark> for inference

Given the document-words matrix $D(m*n)$, do the singular decomposition

Similar words/documents map to similar locations in the low dimensional space

This is hard to interpret (the vectors for docs/words)

### <mark>PLSA</mark>

Probabilistic Latent Semantic Analysis is a latent variable model that maps high dimensional document vector space representation to lower dimensional representation

- <mark>Dimensionality Reduction</mark>
- PLSA evolved from LSA by adding a <mark>sounder probabilistic model</mark>
- Models word-document co-occurrences as a mixture of conditionally independent multinomial distributions
  - <mark>Words are observed</mark>
  - <mark>Topics are latent</mark>
- Apply <mark>EM</mark> (Expectation-Maximisation) for inference

Generative distribution:

$p(D,W) = \prod_d\prod_wp(d,w) = \prod_d\prod_wp(d)\sum_zp(w|z)p(z|d)$

Log likelihood:

$L = \sum_d\sum_wlog[p(d)\sum_zp(z|d)p(w|z)]$

$ = \sum_d\sum_wlogp(d)+\sum_d\sum_wlog\sum_zp(z|d)p(w|z)$

The <mark>expectation-maximisation algorithm</mark> is an iterative method to find (local) maximum likelihood or maximum a posteriori (MAP) estimated of parameters in statistical models, where the model depends on <mark>unobserved latent variables</mark>

The <mark>E step</mark> computes the posterior probabilities of the <mark>unobserved latent variable $z$</mark>

- Compute posterior probabilities for $z$ (choose the assignments for the latent $z$)
- $p(\hat{z}|w,d) = \frac{p(\hat{z},w,d)}{p(w,d)} = \frac{p(d)p(\hat{z}|d)p(w|\hat{z})}{\sum_zp(d)p(z|d)p(w|z)}$
- The numerator is the multinomials, and the denominator is a normalisation which integrates out all of the topics

The <mark>M step</mark> uses the <mark>knowledge from E</mark> to <mark>update the parameters</mark> using the given posterior probabilities

- This updates parameters using given posterior probabilities by MLE
- Rewrite the objective constraint:
- $L = \sum_d\sum_wn(d,w)\sum_zp(z|w,d)log\ p(d)p(w|z)p(z|d) + \alpha(1-\sum_dp(d)) + \sum_d\beta_d(1-\sum_zp(z|d)) + \sum_z\gamma_z(1-\sum_wp(w|z))$
- $n(d,w)$ is the number of times word $w$ appears in document $d$
- $1-\sum\limits_{w_j}p(w_j|z) = 0 \rightarrow p(w_j|z_t) = \frac{\sum_dn(d,w_j)p(z_t|w_j,d)}{\sum_w\sum_dn(d,w)p(z_t|w,d)}$
- $1-\sum\limits_{z}p(z|d_i) = 0 \rightarrow p(z_t|d_i) = \frac{\sum_wn(d_i,w)p(z_t|w,d_i)}{\sum_w\sum_zn(d_i,w)p(z_t|w,d_i)}$

<mark>Strengths:</mark>

- <mark>Graphical</mark> model: easy to extend
- A clear <mark>probabilistic interpretation</mark> (every topic + word connected by a multinomial distribution)
- EM algorithm is simple

<mark>Limitations:</mark>

- <mark>Difficult to scale up</mark>
  - Prone to <mark>overfitting</mark>
  - <mark>Hard to generalise</mark> to unseen documents (inference is on collection of documents)
  - Easy to be stuck at <mark>local minimum</mark>

### <mark>LDA</mark>

Latent Dirichlet Allocation is a <mark>Bayesian version of PLSA</mark>, and the document-topic and word-topic distribution are assumed to have a <mark>sparse Dirichlet prior</mark>

The Dirichlet distribution is an <mark>exponential family distribution</mark> over the simplex, i.e. positive vectors that sum to one

$p(\theta|\alpha) = \frac{\Gamma(\sum_{k=1}^K\alpha_k)}{\prod_{k=1}^K\Gamma(\alpha_k)}\prod\limits_{k=1}^K\theta_k^{\alpha_k - 1}$

If $\alpha$ is a scalar parameter, i.e. $a = \sum \alpha_k/K$, then:

$p(\theta|\alpha, K) = \frac{\Gamma(K\alpha)}{\Gamma(\alpha)^K}\prod\limits_{k=1}^K\theta_k^{\alpha - 1}$

Dirichlet is <mark>conjugate to the multinomial</mark>, so given a multinomial observation, the posterior distribution of $\theta$ is a Dirichlet

LDA <mark>trades off two goals</mark> by the sparse Dirichlet prior

1. For each <mark>document</mark>, allocate its words to as <mark>few topics as possible</mark>
2. For each <mark>topic</mark>, assign <mark>high probability</mark> to as <mark>few terms as possible</mark>

LDA typically works better than PLSA because it can <mark>generalise to new documents easily</mark>

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

The <mark>EM algorithm is not applicable</mark> because at the E-step, the posterior probabilities of z is intractable ($\theta$ cannot be integrated out as it is a continuous variable)

If the posterior is intractable, we can propose a variational distribution to approximate it:

We can use <mark>Jensen's inequality</mark> on a general case to do this

For LDA, we'd use a <mark>variational distribution</mark> to approximate the true posterior

To evaluate LDA, we can use:

- <mark>Perplexity</mark> (normalised log-likelihood)
  - $ppx = exp(-\frac{1}{D}\sum_d^D \frac{1}{N_d}log\ p(d))$
  - This is an evaluation for <mark>all of the documents</mark>
  - It represents the <mark>ability for it to generalise</mark>
- <mark>Topic Coherence</mark> (normalised point-wise mutual information)
  - $w_i, w_j$ are the top-n words in the topic $T$
  - $NPMI(T) = \sum_i\sum_j\frac{log\frac{P(w_i,w_j)}{P(w_i)P(w_j)}}{-log\ P(w_i,w_j)}$
  - The higher the average pairwise similarity between words in $T$, the <mark>more coherent the topic is</mark>
  - It gives us a measure for the <mark>quality of a topic</mark> - how expressive it is

## Neural Topic Models

### <mark>Autoencoders</mark>

Autoencoders take an <mark>input $x$</mark>, the <mark>encoder</mark> maps it to a <mark>lower dimension latent space $h$</mark>, and then the <mark>decoder</mark> maps the lower dimension space back to the <mark>output $x$</mark> again

It's a type of <mark>artificial neural network</mark> used to learn efficient data representations in an unsupervised manner

The aim is to learn a representation for a set of data, typically for dimensionality reduction

- <mark>Dimensionality Reduction</mark>
- <mark>Unsupervised</mark> Learning
- Different raw data: image/text/audio etc.
- Auto-encoder can be considered as <mark>non-linear PCA</mark>
- Objective: $\mathcal{L}(x,\hat{x}) = ||x = \hat{x}||$

### <mark>Variational</mark> Autoencoders

In a VAE, the <mark>encoder:</mark>

1. Takes the input $x$ and maps it to a lower dimension space $x \rightarrow h$
2. <mark>Samples $z$ from a normal distribution</mark> $z \sim \mathcal{N}(\mu(h), \sigma(h))$

The decoder them maps from the lower dimensional space $z$ to $x$

They are <mark>generative models</mark>, whose posterior is approximated by a neural network, forming an autoencoder like architecture that is trained to <mark>minimise the reconstruction error</mark> between the <mark>encoded inputs and generated outputs</mark>

- <mark>Generative models</mark>
- Gaussian KLD <mark>regularises the latent layer</mark>
- Ability to <mark>estimate uncertainty</mark>
- Trained by <mark>stochastic gradient back-propagation</mark>
- Objective: $\mathcal{L}(x,\hat{x}) = ||x - \hat{x}|| + KLD(q(z|x)||p(x))$
- This can also be written as: $- \mathbb{E}_{q(z|x)}[log\ p(x|z)] + KLD(q(z|x)||p(z))$

We can also have <mark>families of autoencoders</mark>, where the loss is:

$\mathcal{L} = \mathbb{E}_{q(z|x)}[log\ p(x|z)] +- \alpha \cdot KLD(q(z|x)||p(z))$

When $\alpha$ is smaller, there is more focus on the reconstruction error, leading to better representation learning

When $\alpha$ is larger, there is more focus on KLD, which leads to better generalisation ability on the data

If $\alpha = 0$, then it's similar to a deterministic autoencoder (only uses reconstruction error)

Therefore, the VAE is <mark>trading off representation learning and generalisation ability</mark>

It uses the <mark>reparameterisation trick:</mark>

- If the <mark>sampling of $z$</mark> is done in the <mark>stochastic later</mark>, then it's hard to da a backwards pass, as this <mark>blocks gradients</mark>
- Therefore, the value of $z$ is now $\mu + \varepsilon \cdot \sigma$, where <mark>$\varepsilon$ comes from another input to $z$</mark>, and it's sampled from a normal distribution $\mathcal{N}(0,I)$
- This means that this now doesn't block anything, and the values of $\mu$ and $\sigma$ which come from the encoder can learn

### Auto-encoder vs VAE

| Auto-Encoder                                                  | Variational Auto-Encoder                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| <mark>Deterministic Neural Network</mark>                     | <mark>Generative</mark> Models                                                                               |
| <mark>Non interpretable</mark>                                | <mark>Latent variables are interpretable</mark>                                                              |
| Dimensionality Reduction based on r<mark>econstruction</mark> | Dimensionality Reduction based on the <mark>trade-off between reconstruction and prior regularisation</mark> |
| Gradient back-propagation                                     | <mark>Stochastic</mark> gradient back-propagation                                                            |

### VAEs for Neural Topic Models

To generate neural topic models, the <mark>input of the VAE should be words $w$</mark>

These are <mark>mapped to $h$</mark>, and from these <mark>$z$ are sampled</mark>

These <mark>$z$</mark> are interpreted as <mark>Latent Topics</mark>, which is what we want to discover

We can then reconstruct the words $w$ from these latent topics $z$

The encoder:

- Takes in <mark>bag-of-words $w$</mark>
- Maps to <mark>lower dimension bag-of-embeddings</mark> by MLP layer
- Adds another MLP later to get better representations
- Then maps to another layer of <mark>$\mu$ and $\sigma$</mark>, which are <mark>reasonable parameters for a Gaussian distribution</mark>
- Then from here,<mark> $z$ are sampled</mark> from this layer using the formula $z = \mu + \varepsilon \cdot \sigma$, where $\varepsilon \sim \mathcal{N}(0,I)$

The decoder:

- The decoder maps from the <mark>sample $z$ back to the high dimensional dimension space</mark> (bag-of-words)
- Example 1: It uses a <mark>softmax decoder</mark>
  - $log\ p(w|z) = log\ softmax(z \cdot W^T)$
  - The conditional probability over words (decoder) is modelled by multinomial logistic regression and shared across documents
  - Reconstruction error is the cross entropy sum of all the words
- Example 2: It uses a <mark>mixture of multinomials</mark>
  - $log\ p(w_n|\beta,\hat{\theta}) = log \sum_{z_n}[p(w_n|\beta_{z_n})p(z_n|\hat{\theta})] = log(\hat{\theta} \cdot \beta)$
  - Here, the latent topics $z$ are integrated out
  - This aligned with the conventional concept of topic models (using a mixture of multinomials)

The KL-Divergence between two multivariate Gaussian distributions are mathematically tractable

The VAE take discrete output and returns discrete outputs:

- $p(w|z)$ is the topic distribution over words
- $p(z|w)$ is the document distribution over topics

## NTM vs LDA

| NTM                                                             | LDA                                                                   |
| --------------------------------------------------------------- | --------------------------------------------------------------------- |
| <mark>Gaussian</mark> Prior                                     | <mark>Dirichlet</mark> Prior                                          |
| Neural variational inference (gradient backpropgation)          | Mean field variational inference, Gibbs sampling (VEM/MCMC sampling)) |
| <mark>Auto-encoding neural</mark> structure                     | <mark>Probabilistic</mark> distributions                              |
| <mark>No restriction</mark> on extending new info               | Extensions are limited to <mark>conjugate models</mark>               |
| Testing on new documents: <mark>one pass</mark> through encoder | Testing on new documents: <mark>re-process all documents</mark>       |

NTM combined both the merits of probabilistic models and neural networks

### NTM with meta info

NTM can also take <mark>meta information</mark>, such as authors, time, and geographical locations

The latent variable then captures all of this information too, and can reconstruct it all back

### Sequence VAE

<mark>Posterior collapse:</mark>

- Gradient vanishment (attentions cannot go through the latent layer)
- KLD is easier to optimise than reconstruction error
- Amortisation gap (the gap between the log-likelihood and the ELBO)

Measures to <mark>alleviate the issue:</mark>

- Annealing KLD
- Word dropout
- Stochastic variational inference
