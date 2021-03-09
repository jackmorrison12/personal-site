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

A lassical ML pipeline in vision consists of the following:

Images --> Features --> Classification/Prediction

Where the first transition $\mathbf{x} = f(\mathbf{I})$, where $\mathbf{x}$ are the set of features, and $\mathbf{I}$ is an image

This process is known as feature extraction

The second transition is $h_\Theta(\mathbf{x})$, where $\mathbf{x}$ is the set of features, and $h_\Theta$ is the model used to obtain the classification or prediction

### Feature extraction and descriptors

Features should be:

- Distinctive and discriminative
- Local
- Invariant to viewpoint changes or transformations
- Invariant to illumination changes
- Efficient to compute
- Robust to noise and blurring
- Hierarchical to allow abstraction

Some examples are:

- Intensities
- Gradients
- Histogram
- SIFT
- HoG
- SURF
- BRIEF
- LBP
- Haar

#### Intensity

Use the intensity information directly, it can be done at:

- Pixel level
  - Not discriminative
  - Localised
  - A single pattern doesn't represent any local patterns though, so it's hard to use
- Patch level
  - More discriminative
  - Not necessarily rotation invariant
  - Semi-localised
- Image level

  - Discriminative
  - Not necessarily rotation invariant
  - Not localised

  Patch and image level intensities can use histograms instead

#### SIFT

This is robust to viewpoint, illumination changes and noise

It transforms an image into a large collection of local feature vectors

It has 4 stages:

1. Scale-space extrema detection
   - For all scales s = 1,...,S, compute convoltion with Gaussian of scale $\sigma_s$s
   - Compute the difference of Gaussians
   - Detect local maxima and minima by comparing pixels to their neighbours at the same scale as well as scales above and below
2. Keypoint localisation
   - Refine the extimation for the location of keypoint
   - For keypoint, fit a quadatic function to the detector response and estimate a refined optimal point
   - Threshold the keypoint response
3. Orientation assignment
   - Take a small window around the kypoint location
   - An orientation histogram with 36 bins covering 360 degrees is created
   - Each pixel votes for an orientation bin, weighted by the gradient magnitude (after applying a Gaussian filter with keypoint scale $\sigma$)
   - Keypoint will be assigned an orientation which is the mode of the distribution
4. Keypoint descriptor
   - Take a small window around the keypoint location
   - As before, calculate the gradient magnitudes and orientations for the pixels, after applying a Gaussian filter with the keypoint scale $\sigma$
   - Rotate the gradient orientations relative to the dominant orientation $\theta$
   - Create a historgram of gradient orientations for each subregion of the window

#### HoG

1. Preprocessing
   - Crop and resize the image
2. Calculate image gradients
   - Convolve with gradient filters \[-1, 0, 1\] and \[-1, 0, 1\] $^T$
3. Calculate histogram of gradients in 8x8 cells
4. 16x16 block normalisation
5. Calculate the HoG feature vector

#### SURF

- This stands for speeded-up robust features
- It detects transitions from black to white in each direction
- It is much faster than SIFT, as it only uses simple Haar wavelets in calculation

#### BRIEF

- A point p is compared to another point q, both randomly samples
- $\tau(p,q) = \begin{cases}
 1, \mathsf{if}\ I(p) < I(q)\\
 0, \mathsf{otherwise}
\end{cases}$
- The point (p, 1) is randomly samples
- Overall $n_d$ pairs of points are randomly samples for binary tests, and the BRIEF descriptor can be defined as an $n_d$ dimensional bit string

#### LBP

- this is contrast insensitive
- Fast to compute

#### Haar features

- Inspired by wavelet analysis
- Can be thought of as convolution operators
- However, convolutions are inefficient
- Faster computation via integral images S

### Models

$h_\Theta(\mathbf{x})$ can be of many forms, including:

- Logistic regression
- Naive Bayes
- KNN
- SVM
- Boosting
- Decision/Random forests
- Neural networks

However, they all have two errors: bias and variance

Bias comes from:

- How much, on average, predicted values are different from the actual value
- High bias error means we have an underperforming model
- Misses important trends

Variance comes from:

- How much predictions made from different samples vary from eachother
- High variance error means the model will overfit and perform badly on any observation beyond training

Error(x) = Bias$^2$ + Variance + Irreducible Error

### Ensemble Learning

- This is where the predictions of a group of predictors are aggregated
- This group of predictors is called an ensemble
- A learning algorithm which uses multiple models, such as classifiers or experts, is called Ensemble LEarning
- In many cases, the aggregated answer is better than the best individual prediction (for non-correlated ensembles)

There are two types:

- Homogenous
  - Models built from same ML class (weak learner)
  - Each model has slightly different subsets of the data
- Heterogenous
  - Models built from different ML classes

To decrease bias:

- Sequential - base ML learners added one at a time, is labelled examples upweighted each time
- Exploit the dependence between base learners, thus learning a complementary set of predictors that reduces bias and increases accuracy

To decrease variance:

- Parallel - many independent base learners are trained simultaneously and then combined
- Combines prediction learnt from multiple models run independently average away impact of isolated errors, thur reduces variance on the prediction

A weak learner is defined to be a classifier that's only slightly correlated with the true classification (slightly better than random guessing)

A strong leaner is a classifier that is arbitrarily well correlated with the true classification

#### Bagging

Reduce model variance through averaging

For n independent samples,

$var(\bar{X}) = \frac{var(X)}{n}$

Bootstrapping:

1. Take the original dataset X with N training samples
2. Create T copies $\{\tilde{X}_n\}_{n=1}^T$
   - Each $\tilde{X}$ will be different since some examples may be repeated while others will not be samples at all
3. Train a separate weak learner on each bootstrap example

To aggregate results:

- For classification, assuming T classifiers, do a majority vote
- For regression, assuming T regressors, take the average over the results

This can be evaluated using out-of-bag error

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

Rather than building independent weak learners in parallel and aggregating at the end, we can build them in serial, but adaptively reweight the training data prior to training each new learner in order to give a higher weight to previously mismatched examples

There are several variants of this, including Adaboost, Gradient Tree Boosting and XGBoost

Adaboost uses decision stumps as weak learners

1. Initially, all examples are given equal weight
2. Training subsets are bootstrapped from the full dataset using weighted probabilities
3. A new classifier is fit
4. Then examples are upweighted if they are misclassified and downweighted if they are correctly classified

### Decision Trees

In a decision tree, the internal nodes store a split function to be applied to incoming data

Each leaf stores the final answer

There are two tyoes:

1. Classification tree
   - The predicted outcome is the class which the data belongs to
2. Regression tree
   - The predicted outcome can be considered a real number

A probabilistic distribution is attached to each leaf node, which is a histogram of classes spanned by that leaf node

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

1. Information gain
   - Decrease in entropy after a dataset is split on an attribute
2. Gini index
   - Indicated how mixed the classes are following the split

Entropy measures the level of impurity in a group of examples - higher entropy = higher uncertainty

The expected information gain is the change in entropy from a prior state to a state that takes some information as given

In other words: Information gain - entropy(parent) - (weighted_average_entropy(children))

The Gini index, on the other hand, indicates how mixed the classes are following the split

Perfect separation results in a score of 0 whereas worst case split (50/50) results in a score of 0.5 for a two class problem

We want to MINIMISE Gini index and MAXIMISE information gain

### Decision trees as weak learners

Single decision trees are prone to overfitting, particularly if tree depth is uncontrolled, but robustness can be significantly increased by combining trees in ensembles

They're among the most popular weak learners for homogenous ensemble learning

Random forests form an ensemble of uncorrelated classifiers exploiting random subsampling of the:

- training data used to build each tree
- set of features that are used for selection of the splits
- set of feature values that are used for splitting
