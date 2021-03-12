---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Unsupervised Learning
slug: unsupervised-learning
topic: 5
hidden: false
tags:
  - Unsupervised Learning
---

Supervised learning is where we assume that we have training data and their respective ground truth labels

The goal is to train a model and derive a good set of parameters to make a decision on new data of just features

Unsupervised learning, on the other hand, is only given the data in raw form, with no labels

Some examples are:

- Clustering (finding clusters in the data)
- Dimensionality Reduction (Extracting a lower-dimensional representation of the data, preserving the inherent dimensionality of interest)
- Anomaly detection (finding outliers)
- Visualisation of high-dimensional data (helps us understand the structure of the data)

Some implementations are:

- Clustering
  - K-Means
  - Mixture Models
- Dimensionality Reduction
  - PCA
  - Sparse Coding
  - Autoencoders
- Generative Modelling
  - 101
  - VAEs
  - GANs

## Clustering

Given the data, we do some automatic semantic indexing, not assuming we know about the semantics beforehand

Sometimes, gathering annotations / ground truth can be costly or cumbersome

Clustering can also identify novel ways to group subsets of data semantically, then these clusters can be annotated if required

An example is unsupervised image segmentation

### K-Means Clustering

This is the most widely used clustering algorithm

Given a grid of points, initialise k centroids, then for each point find the distance to the closest centroid, and then for these clusters the mean is the new position of the centroid

- Input $x_n, 1 \leq n \leq N$
- Initialise centroids \$$\mu_k, 1 \leq k \leq K$L e.g. randomly choose K distinct input points
- Until the stopping criterion is met (cluster assignments converge):
  - For each point $n$, $c_n = $ index $ \in \{1, ..., K\}$ of the closest centroid to $x_n$
  - For each cluster $k$, $\mu_k = $ average of the points assigned to cluster $k$
- Output cluster centroids and/or cluster assignments

Disadvantages:

- Bad initialisation can yield bad clustering
- Prefers roughly equal size clusters
- Crosses intuitively low-density splits

The cost function we are trying to minimise is:

$\min\limits_{\{z_{nk}\},\{\mu_k\}} \sum\limits_k \sum\limits_n z_{nk} ||x_n - \mu_k||^2$ such that $\forall n,k,z_{nk} \in \{0,1\}$ and $\forall n, \sum\limits_k z_{nk} = 1$

Since it is alternating between the two steps, this is what minimises the cost function (and why there are two things to minimise on)

It's a greedy algorithm

The solution may lead to a local minima, and therefore you may need to run it multiple times with different starting points and choose the one with the lowest cost

### Mixture Model

To represent one cluster, we can use a statistical model, and therefore we use a mixture for several clusters, where each cluster is represented by a single Gaussian

A Gaussian Mixture Model s a weighted sum of normal distributions

$p(x) = \sum\limits_{k=1}^K \pi_k\mathcal{N}(x|\mu_k, \sigma_k^2)$

Where:

- $\pi_k$ is the weighting term for each of the k distributions
- $\mathcal{N}$ is the normal distribution
- $\mu_k$ is the mean
- $\sigma_k^2$ is the variance

More components can make for a more accurate clustering, however eventually it still breaks and has high variance

It's an iterative method to estimate parameters of s statistical model where the model depends on unobserved latent variables

- Given some data: $x = \{x_n\}_{n=1}^N$
- Parameters: $\theta = \{\pi_k, \mu_k, \sigma_k\}$
- Latent variables: $Z = \{z_{nk}\}_{n \leq N, k \leq K}$ with $z_{nk} = 1 $ iff $n$ belongs to cluster $k$

The EM algorithm alternated between:

- E-step: determine $p(Z|X,\theta)$
- M-step: update $\theta$

EM greedily maximises a lower-bound of the marginal likelihood $\mathcal{L}(\theta) = log p(X | \theta)$

The number of clusters is user given, however is harder when there are more classes

We can therefore use:

1. Elbow method - this is where the cost each solution produces will decrease until a point of diminishing returns - the elbow is the number of clusters which should be used
2. Application-based rationale (e.g. knowing the brain can be split into 3 clusters)
3. Bayesian Mixture Models (you don't choose, learn the number of clusters)
4. Persistence diagrams

K-means handles anisotropic data and non-linearities poorly, since it uses Euclidean distance

To cluster by more complex geometries, we could:

1. Lift the data to a feature space where it can be described in linear terms
2. Geometry-inspired formulation (manifold of data)

## Dimensionality Reduction / Data Encoding

This is where you find data encodings in a lower dimensional space which will represent the variation in the input data

There are two ideas: exploiting redundancies in either the image or the dataset

Some applications of this are:

- Data visualisation
- Image compression
- Modelling

### Principal Component Analysis (PCA)

1. Build the design matrix (each row is a dim, each col is a data point)
2. Center the design matrix $X' = \frac{1}{\sqrt{n-1}}(X - \mu_X)$
3. Decomposition of the $m \times m$ covariance matrix $UDV^T = SVD(X'X'^T)$, where $U = (u_1|...|u_m)$: principal directions, $D = diag(\lambda_i)$: variances along $u_i$s

There is another variant, where for the last step, you do $UDV^T = SVD(X')$, where $d = diag(\lambda_i)$: std along $u_i$s

This is more computationally efficient, as there is no matrix multiplication

For linear encoding and decoding:

- $x_*$ can be projected onto the principal directions by $v_* = U^T x_*$
- You can reconstruct $\hat{x}$ from the reduced coordinates $v_*$ by doing $\hat{x} = Uv_*$

### Active Appearance Model

This is where you have a shape and appearance model for images

You have point sets, which correspond to anatomical landmarks, and can be used to model expression

All images are normalised based off of the point sets

1. Shape model = mean + eigenmodes (PCA on the landmarks throughout the face)
2. Warp image so that landmarks fir the mean template
3. Appearance model (PCA on shape-free patches)
4. PCA jointly on the shape and appearance parameters to capture correlations

To test on a new image, so iterative optimisation of the AAM PCA parameters to minimise reconstruction error $||I-\hat{I}||^2$

### PCA Interpretation

1. $k$th eigenvector maximises the explained variance in the subspace orthogonal to all previous eigenvectors, e.g. $u_1 = arg \max\limits_{||u||=1} u^TX'^Tu$
2. PCA fits an ellipsoid to the data, more formally a Gaussian distribution
3. The first $k$ PCA eigendirections yield optimal $L_2$ reconsruction among all linear models of rank $\leq K$
4. PCA is a linear probabilitic model

### Autoencoders

PCA is a linear encoder/decoder - we understand the latent space

In an autoencoder, we don't necessarily know this

They are general encoder/decoder architectures with non-linearities

\for each input, we generate a vector of data you need to reconstruct it, however similar images do not necessarily have similar latent space representations

There are many possible architectures, such as MLP or convolutional autoencoders

The reconstruction loss is $\mathcal{L}_{\phi,\theta}(x, \hat{x}) = ||x - \hat{x}()\phi, \theta)||^2$

They don't justt learn the identity map because:

1. Bottleneck in the code: dim($z$) $<<$ dim($x$)
2. Add regularisation: $\mathcal{L}_{\phi,\theta} + \lambda \cdot \mathcal{R}(\phi, \theta)$
3. By training on corrupted input $\tilde{x}, e.g. Gaussian noise/dropout$

Unlike PCA, the latent space $z$ is non trivial to visualise or generate new samples from

## Generative Modelling

This allows us to generate new data corresponding to a learned distribution

You model the process through which data is generated, capturing the structure in the data (like dependencies and causal links)

It mostly subsumes other tasks like clustering and dimensionality reduction

It introduces latent parameters if necessary. Since they're unknown, probability distributions are assigned to them

Bayesian framework allows to:

- Model probabilistically, manipulate probabilistic variables
- Make optimal predictions in the presence of unknown

|               | Supervised                                                                        | Unsupervised                                                                                                                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Training time | - Both image and label observed<br>- Learn the parameters of discriminative model | - Only input image observed<br>- Given latent variables, learn params to get the probability of observing images in the training dataset                                                                                                            |
| Test time     | Given input image, apply the trained model to get an output label                 | - Given the image set, infer the variables in the latent representation (for encoding/clustering)<br>- Given latent code, generate new realistic looking samples<br>- We can also, for a given input, do outlier detection by looking at the result |

### PCA as a linear generative model

The latent code can be modelled as $w_n \sim \mathcal{N}(0,I)$

The linear decoder is therefore: $x_n = Uw_n + \mu$

We fit a Gaussian distribution to the training data, sample latent variables from the Gaussian distribution, and to get a sample point, use the params of the PCA model

However, PCA is sensitive to outliers, as the Gaussian distribution is not heavily tailed, so it's not very robust

Therefore, instead of $x_n \sim \mathcal{N}(\mu, \Sigma)$, use $x_n \sim \mathcal{S}(\mu, \Sigma, v)$ (student-t distribution)

This assigns low probabilities to points far away from the mean

### GMM generative model

The latent code: $w_n \sim \mathcal{N}(0,1)$, $c_n \in \{1,...,K\} \sim \mathcal{C}(\{\pi_k\}_{k \leq K})$

Decoder: $x_n = \sigma_{c_n}w_n + \mu_{c_n}$

The non-linear models are represented by the throw of a dice as to which sample it will belong to

To decode, you generate a new data point: var \* weight + mean from corresponding component

Fully Bayesian GMMs use hyperpriors to choose the number of clusters

The Dirichlet hyperprior on $\pi$ can favour few non-zero clusters

Normal-inverse-Wishart hyperprior on $\mu, \Sigma$ avoids degenerate clusters that shrink zero-variance

### Black box Generative Modelling

This uses generic architectures, such as NNs

It automatically captures the structure and learns the factors responsible for the variation in the data

They allow shape interpolation and arithmetic

You use the encoding ability to map to the latent space

Given two vectors in the latent space, you can interpolate between them and reconstruct from these interpolated points

Intermediate points should also give a realistic sample

### Gaussian Variational Autoencoder (VAE)

This takes an input x, and uses an encoder to produce a latent code which is Gaussian distributed

A generator can then take this value from the latent space and return something in the input space

There is no enforcement of a manifold, therefore you can't interpolate in the latent space

At training time, you learn the gaussian parameters and the neural network weights

Taking input $x$, the Encoder ($NN_\phi$) returns $\mu_\phi(x)$ and $\sigma_\phi(x)$ over the latent code

To generate samples, you sample a latent code $z \sim \mathcal{n}(0,I)$

Using the generator ($NN_\theta$), get the component-wise mean and variance for $x_*$, which are $\mu_\theta(z)$ and $\sigma_\theta(x)$

You can then sample a new $x_*$ from the Gaussian $\epsilon \sim \mathcal{N}(0,I)$ where $x_* = \mu_\theta(z) + \epsilon \cdot \sigma_\theta(z)$

VAEs learn an explicit encoding $q_\phi$ from input to latent

They only indirectly fit marginal distribution $p_\theta(z)$ - the design is not optimised for sample realism

Modelled data distribution depends on latent prior $p(z)$

### Generative Adversarial Networks (GANs)

These consist of a generator and a discriminator

They optimise a minimax objective designed to encourage high quality samples

The generator tries to fool the discriminator, and the discriminator learns to classify generated vs real data samples

### GAN vs VAE

| GAN                                                            | VAE                                                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| - Focus on sampling<br>- Produce realistic samples             | - Focus on representational learning<br>- They learn to encode and reconstruct                  |
| Trained by playing minimax game                                | Trained by ELBO maximisation                                                                    |
| Marginal $p(x)$ explicitly encouraged to fit $p_{data}$        | Distribution of real data latent code may be mismatched with prior                              |
| Latent space explicitly encouraged to map to plausible samples | Then latent codes can map to implausible samples                                                |
| Mode collapse: GANs may produce a limited variety of samples   | Objective encourages cycle consistency (co reconstructed data is very similar to original data) |
