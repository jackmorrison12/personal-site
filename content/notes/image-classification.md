---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Image Classification
slug: image-classification
topic: 2.1
hidden: false
tags:
  - Classification
---

## What is classification?

A classical ML pipeline in vision consists of the following:

<mark>Images</mark> $\rightarrow$ <mark>Features</mark> $\rightarrow$ <mark>Classification</mark>/Prediction

With the first transition as <mark>$\mathbf{x} = f(\mathbf{I})$</mark>, where $\mathbf{x}$ are the set of features, and $\mathbf{I}$ is an image

This process is known as <mark>feature extraction</mark>

The second transition is <mark>$h_\Theta(\mathbf{x})$</mark>, where $\mathbf{x}$ is the set of features, and $h_\Theta$ is the <mark>model</mark> used to obtain the classification or prediction

### Feature extraction and descriptors

Features should be:

- <mark>Distinctive</mark> and <mark>discriminative</mark>
- <mark>Local</mark>
- Invariant to <mark>viewpoint changes</mark> or transformations
- Invariant to <mark>illumination changes</mark>
- <mark>Efficient</mark> to compute
- Robust to <mark>noise</mark> and blurring
- <mark>Hierarchical</mark> to allow abstraction

Some examples are:

- <mark>Intensities</mark>
- <mark>Gradients</mark>
- <mark>Histogram</mark>
- SIFT
- HoG
- SURF
- BRIEF
- LBP
- Haar

#### Intensity

Use the <mark>intensity information directly</mark>, it can be done at:

- <mark>Pixel</mark> level
  - Not discriminative
  - Localised
  - A single pattern doesn't represent any local patterns though, so it's hard to use
- <mark>Patch</mark> level
  - More discriminative
  - Not necessarily rotation invariant
  - Semi-localised
- <mark>Image</mark> level
  - Discriminative
  - Not necessarily rotation invariant
  - Not localised

Patch and image level intensities can use histograms instead

#### <mark>SIFT</mark>

This is <mark>robust to viewpoint, illumination changes</mark> and <mark>noise</mark>

It transforms an image into a <mark>large collection of local feature vectors</mark>

It has 4 stages:

1. <mark>Scale-space extrema detection</mark>
   - For all scales s = 1,...,S, compute convolution with Gaussian of scale $\sigma_s$s
   - Compute the difference of Gaussians
   - Detect local maxima and minima by comparing pixels to their neighbours at the same scale as well as scales above and below
2. <mark>Keypoint localisation</mark>
   - Refine the estimation for the location of keypoint
   - For keypoint, fit a quadratic function to the detector response and estimate a refined optimal point
   - Threshold the keypoint response
3. <mark>Orientation assignment</mark>
   - Take a small window around the keypoint location
   - An orientation histogram with 36 bins covering 360 degrees is created
   - Each pixel votes for an orientation bin, weighted by the gradient magnitude (after applying a Gaussian filter with keypoint scale $\sigma$)
   - Keypoint will be assigned an orientation which is the mode of the distribution
4. <mark>Keypoint descriptor</mark>
   - Take a small window around the keypoint location
   - As before, calculate the gradient magnitudes and orientations for the pixels, after applying a Gaussian filter with the keypoint scale $\sigma$
   - Rotate the gradient orientations relative to the dominant orientation $\theta$
   - Create a histogram of gradient orientations for each subregion of the window

#### <mark>HoG</mark>

1. Preprocessing
   - <mark>Crop and resize</mark> the image
2. Calculate <mark>image gradients</mark>
   - Convolve with gradient filters \[-1, 0, 1\] and \[-1, 0, 1\] $^T$
3. Calculate <mark>histogram of gradients</mark> in 8x8 cells
4. 16x16 block normalisation
5. Calculate the HoG feature vector

#### <mark>SURF</mark>

- This stands for <mark>speeded-up robust features</mark>
- It detects <mark>transitions from black to white</mark> in each direction
- It is much faster than SIFT, as it only uses simple Haar wavelets in calculation

#### <mark>BRIEF</mark>

- A point p is compared to another point q, both randomly sampled
- $\tau(p,q) = \begin{cases}
 1, \mathsf{if}\ I(p) < I(q)\\
 0, \mathsf{otherwise}
\end{cases}$
- The point (p, q) is randomly sampled
- Overall <mark>$n_d$ pairs of points are randomly samples</mark> for binary tests, and the BRIEF descriptor can be defined as an <mark>$n_d$ dimensional bit string</mark>

#### <mark>LBP</mark>

- This is <mark>contrast insensitive</mark>
- <mark>Fast</mark> to compute

#### <mark>Haar</mark> features

- Inspired by wavelet analysis
- Can be thought of as convolution operators
- However, convolutions are inefficient
- Faster computation via integral images

### Models

$h_\Theta(\mathbf{x})$ can be of many forms, including:

- <mark>Logistic regression</mark>
- Naive Bayes
- KNN
- SVM
- <mark>Boosting</mark>
- Decision/Random forests
- <mark>Neural networks</mark>

However, they all have two errors: <mark>bias and variance</mark>

<mark>Bias</mark> comes from:

- How much, on average, <mark>predicted values are different from the actual value</mark>
- High bias error means we have an underperforming model
- Misses important trends

<mark>Variance</mark> comes from:

- How much <mark>predictions made from different samples vary from each other</mark>
- High variance error means the model will overfit and perform badly on any observation beyond training

<mark>Error(x) = Bias$^2$ + Variance + Irreducible Error</mark>

### <mark>Ensemble</mark> Learning

- This is where the <mark>predictions of a group</mark> of predictors are <mark>aggregated</mark>
- This group of predictors is called an ensemble
- A learning algorithm which uses multiple models, such as classifiers or experts, is called Ensemble LEarning
- In many cases, the <mark>aggregated answer is better than the best individual prediction</mark> (for non-correlated ensembles)

There are two types:

- <mark>Homogenous</mark>
  - Models built from <mark>same ML class</mark> (weak learner)
  - Each model has slightly different subsets of the data
- <mark>Heterogenous</mark>
  - Models built from <mark>different ML classes</mark>

To <mark>decrease bias</mark>:

- <mark>Sequential</mark> - base ML learners added one at a time, is labelled examples upweighted each time
- Exploit the dependence between base learners, thus learning a complementary set of predictors that reduces bias and increases accuracy

To <mark>decrease variance</mark>:

- <mark>Parallel</mark> - many independent base learners are trained simultaneously and then combined
- Combines prediction learnt from multiple models run independently average away impact of isolated errors, thur reduces variance on the prediction

A <mark>weak learner</mark> is defined to be a classifier that's<mark> only slightly correlated with the true classification</mark> (slightly better than random guessing)

A <mark>strong leaner</mark> is a classifier that is arbitrarily <mark>well correlated with the true classification</mark>

#### Bagging

<mark>Reduce model variance</mark> through <mark>averaging</mark>

For n independent samples,

$var(\bar{X}) = \frac{var(X)}{n}$

Bootstrapping:

1. Take the <mark>original dataset</mark> X with N training samples
2. Create <mark>T copies</mark> $\{\tilde{X}_n\}_{n=1}^T$
   - Each $\tilde{X}$ will be different since some examples may be repeated while others will not be samples at all
3. Train a <mark>separate weak learner on each bootstrap example</mark>

To aggregate results:

- For <mark>classification</mark>, assuming T classifiers, do a <mark>majority vote</mark>
- For <mark>regression</mark>, assuming T regressors, take the <mark>average</mark> over the results

This can be evaluated using <mark>out-of-bag error</mark>

- With each training set we automatically get the left-out set
- We can use this as a validation set and compute the mean prediction error

```
for each training sample xi:
    find the predictions for all bootstrap examples which do not contain xi
    average the predictions to contain yi'
    compute yi' - yi (where yi is the true value)
    average over all training samples i = 1,...,n
```

#### Boosting

Rather than building independent weak learners in parallel and aggregating at the end, we can <mark>build them in serial</mark>, but adaptively <mark>reweight the training data</mark> prior to training each new learner in order to give a <mark>higher weight to previously mismatched examples</mark>

There are several variants of this, including Adaboost, Gradient Tree Boosting and XGBoost

Adaboost uses decision stumps as weak learners

1. Initially, all examples are given equal weight
2. Training subsets are <mark>bootstrapped</mark> from the full dataset using weighted probabilities
3. A <mark>new classifier</mark> is fit
4. Then examples are <mark>upweighted if they are misclassified</mark> and <mark>downweighted if they are correctly classified</mark>

### Decision Trees

In a decision tree, the <mark>internal nodes</mark> store a <mark>split function</mark> to be applied to incoming data

Each <mark>leaf</mark> stores the <mark>final answer</mark>

There are two tyoes:

1. <mark>Classification</mark> tree
   - The predicted outcome is the <mark>class</mark> which the data belongs to
2. <mark>Regression tree</mark>
   - The predicted outcome can be considered a <mark>real number</mark>

A <mark>probabilistic distribution is attached to each leaf node</mark>, which is a histogram of classes spanned by that leaf node

To partition the feature space to build this tree, you:

1. Randomly produce splits
2. Evaluate which splits are good
3. Split into subtrees
4. Repeat for subtrees

Or more formally:

```
at each node Sj
    for a random subset of features:
        for a random subset of values of this feature in the data set:
            evaluate I(Sj, Aj) // The cost of splitting training data into left/right components
    choose the best feature and value for splitting on
    split data according to this function // Until termination criterion is met
```

The cost, $I(S_j, A_j)$, could either be:

1. <mark>Information gain</mark>
   - Decrease in entropy after a dataset is split on an attribute
2. <mark>Gini index</mark>
   - Indicated how mixed the classes are following the split

Entropy measures the level of impurity in a group of examples - higher entropy = higher uncertainty

The expected <mark>information gain is the change in entropy</mark> from a prior state to a state that takes some information as given

In other words: Information gain - entropy(parent) - (weighted_average_entropy(children))

The <mark>Gini index</mark>, on the other hand, indicates <mark>how mixed the classes are</mark> following the split

Perfect separation results in a score of 0 whereas worst case split (50/50) results in a score of 0.5 for a two class problem

We want to <mark>MINIMISE Gini index</mark> and <mark>MAXIMISE information gain</mark>

### Decision trees as weak learners

<mark>Single decision trees</mark> are prone to <mark>overfitting</mark>, particularly if tree depth is uncontrolled, but <mark>robustness</mark> can be significantly <mark>increased</mark> by <mark>combining trees in ensembles</mark>

They're among the <mark>most popular weak learners</mark> for homogenous ensemble learning

Random forests form an ensemble of uncorrelated classifiers exploiting random subsampling of the:

- training data used to build each tree
- set of features that are used for selection of the splits
- set of feature values that are used for splitting
