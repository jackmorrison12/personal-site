---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Introduction to Imaging
slug: intro
topic: 1
hidden: false
tags:
  - Intro
---

## Common Image Analysis Tasks

- Image <mark>Classification</mark> (what is an image)
- Object <mark>Detection</mark> (is an object in the image)
- Object <mark>Localisation</mark> (where in the image is an object)
- Object <mark>Recognition</mark> (what is each object detected in an image)
- Semantic <mark>Segmentation</mark>
- Image Captioning
- Image Registration
- Object Tracking

## Digit Recognition

Using the MNIST dataset, how can we recognise what number an image is of?

One simple algorithm is <mark>counting</mark> the number of white pixels

This works ok for distinguishing between 2 numbers, however with 10, devising an explicit algorithm based off of simple rules is difficult

An alternative is to <mark>learn</mark> the (possibly complex) <mark>rules</mark> from the <mark>data</mark>

Assuming we are given a lot of examples, we can do this

## What is ML?

_"Field of study that gives computers the ability to <mark>learn without being explicitly programmed</mark>"_ - Arthur Samuel, 1959

_"Machine Learning algorithms build a mathemtical model of sample data in order to make predictions or decisions without being explicitly programmed to perform the task"_ - Wikipedia

They consist of a model, which:

- during <mark>train time</mark>, takes in examples to <mark>learn features</mark> and improve the model's parameters
- during <mark>test time</mark>, takes in data and uses the model to give a <mark>prediction</mark>

### Supervised Learning

This is where the training data is a data set where you are <mark>given the truth value</mark>

Two examples are:

- <mark>Classification</mark>, which predicts a <mark>qualitative</mark> output (e.g. a categorical label)
- <mark>Regression</mark>, which predicts a <mark>quantitative</mark> output (e.g. a real valued number)

Classification trains a <mark>decision boundary</mark>, so a new data point can be predicted by seeing which side of the boundary it falls into

Regression <mark>fits a function</mark> to the data so a new data point can be predicted using this function

So overall, given a vector of input features $x$, we want to learn a predictor $h_\Theta(\mathbf{x})$ that outputs an accurate prediction $y$

$h_\Theta(\mathbf{x})=y$

Using a training set $T = \{(\mathbf{x}^{(i)}, y^{(i)}\}_{i=1}^m$ with $m$ examples, the predictor is trained such that:

$\forall i[h_\Theta(\mathbf{x}^{(i)}) \approx y^{(i)}]$

### Regression

For linear regression, $h_\Theta(x) = \Theta_0 + \Theta_i x$

This allows us to <mark>parameterise a line</mark>

To find this, we need to minimise the following equation:

$\min\limits_{\Theta} \frac{1}{m} \sum\limits_{i=1}^m (h_\Theta(x^{(i)}) - y^{(i)})^2$

### Gradient Descent

This is known as a <mark>cost function</mark>, with this one in particular being the squared difference
Gradient descent is used to minimise the parameters in the equation

Given a hypotheses $h_\Theta$ and a cost function $J(\Theta)$

- Take an initial guess for the parameters $\Theta$
- Keep changing $\Theta$ to minimise $J(\Theta)$ until convergence

The function is written:

Repeat until <mark>convergence</mark>:

$\Theta_j = \Theta_j - \alpha \frac{\delta}{\delta\Theta_j}J(\Theta)$

Where:

- $\alpha$ = learning rate (how big of a step to take along the steepest gradient direction)
- $ \alpha \frac{\delta}{\delta\Theta_j}J(\Theta)$ = parameter update (update on the model parameter)
- $\frac{\delta}{\delta\Theta_j}$ = partial derivative (direction of steepest descent)

### Gradient Descent for Linear Regression

<mark>Rewrite the cost function</mark> to be:

$J(\Theta) = \frac{1}{2m} \sum\limits_{i=1}^m (h_\Theta(x^{(i)}) - y^{(i)})^2$

$ = \frac{1}{2m} \sum\limits_{i=1}^m (\Theta_0 + \Theta_1 x^{(i)} - y^{(i)})^2 $

So to find the <mark>gradient</mark> of this...

$ \frac{\delta}{\delta\Theta_0} J(\Theta) = \frac{1}{m} \sum\limits_{i=1}^m (h_\Theta(x^{(i)}) - y^{(i)})$

$ \frac{\delta}{\delta\Theta_1} J(\Theta) = \frac{1}{m} \sum\limits_{i=1}^m (h_\Theta(x^{(i)}) - y^{(i)})\cdot x^{(i)}$

Therefore, these are substituted into the gradient descent function from earlier, done <mark>individually for $\Theta_0$ and $\Theta_1$</mark>, based on the current set of parameters $\Theta$

Since this <mark>cost function is convex</mark>, there is only <mark>one global minima</mark>, therefore you will always end up with this global minima no matter where you start

For multiple variables, given an input vector $\mathbf{x}$ and output $y$:

$h_\Theta(\mathbf{x}) = \Theta^T\mathbf{x}$

$ = \Theta_0x_0 + \Theta_1x_1 + \Theta_2x_2 + ... + \Theta_nx_n$

This is known as <mark>polynomial regression</mark>, and therefore can fit more complex curves than just a line

### Classification

<mark>Logistic regression</mark> is used for classification

It is used when we can't use linear regression to solve the problem, as we <mark>can't fit a line or curve to the data</mark>

Therefore, we use a sigmoid/logistic function, which is non-linear

For example:

$h_\Theta(\mathbf{x}) = g(\Theta^T\mathbf{x})$

Where:

$g(z) = \frac{1}{1 + e^{-z}}$

The output of $h_\Theta(\mathbf{x})$ will be between 0 and 1

Therefore, you can use a <mark>threshold</mark>, such as the following, the classify between two values of 0 and 1:

$h_\Theta(\mathbf{x}) \geq 0.5 \rightarrow y = 1$ (which happens when $\Theta^T \geq 0$)

$h_\Theta(\mathbf{x}) \lt 0.5 \rightarrow y = 0$

We use a line to define a decision boundary

When we add new points, we <mark>evaluate which side of the line</mark> it lies on in order to classify it

For example, if we had 2 features (imagine a 2D grid of $x_1$ by $x_2$):

$h_\Theta(\mathbf{x}) = g(\Theta_0 + \Theta_1x_1 + \Theta_2x_2)$

This generates a line which is the decision boundary

We can also use <mark>polynomial functions</mark> as the decision boundary, e.g. circles

These are still <mark>linear functions with respect to the parameters</mark>, but they define <mark>more complex shapes in the feature space</mark>

However, now the cost function is <mark>no longer convex</mark>, so we need to rewrite it

$J(\Theta) = \frac{1}{m} \sum\limits_{i=1}^m \mathsf{cost}(h_\Theta(\mathbf{x}^{(i)}), y^{(i)})$

Where:

$\mathsf{cost}(h_\Theta(\mathbf{x}), y) = \begin{cases}
 -log(h_\Theta(\mathbf{x}))\ \mathsf{if}\ y = 1\\
 -log(1-h_\Theta(\mathbf{x}))\ \mathsf{if}\ y=0
\end{cases}$

We can simplify this to

$\mathsf{cost}(h_\Theta(\mathbf{x}), y) = -y\ log\ (h_\Theta(\mathbf{x})) - (1-y)\ log\ (1-h_\Theta(\mathbf{x}))$

This is <mark>now a convex function</mark>, and therefore gradient descent will result in a single global minimum

### Multiclass Classification

This can also be used to do classification with <mark>more than two classes</mark>

One way is to train <mark>one-vs-all classifiers</mark>, and therefore have $k$ different classifiers for $k$ classes

You then take <mark>$\max\limits_i h_\Theta^{(i)}(\mathbf{x})$</mark> in order to get the strongest classification

## Over/Underfitting

### Bias vs Variance

With linear regression, sometimes we can have <mark>too many parameters</mark> in $\Theta$, and therefore we <mark>overfit</mark> to the training data. On the other hand, we cal also have <mark>too few</mark>, and we will <mark>underfit</mark>

<mark>Underfitting</mark> results in <mark>high bias</mark> (the prediction is biased towards the model, and the model doesn't explain training data well)

<mark>Overfitting</mark> results in <mark>high variance</mark> (small x-axis change can cause a large change in output)

If you plot error against the degree of the polynomial, you'll see <mark>training error will decrease as degree of polynomial increases</mark>, however <mark>validation will decrease to a point</mark>, and then start to <mark>increase again</mark>

The point in the middle where they are both lowest is the optimum

A <mark>high error for both</mark> training and validation data implies <mark>high bias</mark>

A <mark>high error for validation</mark> and not training implies <mark>high variance</mark>

### Regularisation

This is used to <mark>discourage learning a more complex model</mark> in order to avoid the risk of overfitting

It's essentially a <mark>penalty term</mark> on the coefficients added to the cost function

For linear regression, a sum of squares regularisation term would look like:

$J(\Theta) = \frac{1}{2m} [ \sum\limits_{i=1}^m (h_\Theta(x^{(i)}) - y^{(i)})^2 + \lambda \sum\limits_{j=1}^n \Theta_j^2] $

For logistic regression, it would similarly look like:

$J(\Theta) = \frac{1}{m} [ \sum\limits_{i=1}^m ( -y^{(i)}\ log\ (h_\Theta(\mathbf{x}^{(i)})) - (1-y^{(i)})\ log\ (1-h_\Theta(\mathbf{x}^{(i)})))  + \frac{\lambda}{2} \sum\limits_{j=1}^n \Theta_j^2] $

There are multiple types of regularisation, including:

- L1 regularisation (lasso penalty), which favours few non-zero coefficients
- L2 regularisation (ridge penalty), which favours small coefficients
- Mixed L1/L2 regularisation (elastic net), which weights both of the above terms

## Features

To learn the possible complex ruled from the data we had earlier in digit recognition, we need to pick a feature vector $\mathbf{x}$

This could be raw pixel values, but this would be loads of parameters (e.g. for a 28x28 image, it would be 785 parameters including bias)

We could therefore reduce this by <mark>measuring different features</mark>, such as digit width, height, slant, thickness or length

However, <mark>hand-crafting the right set of features can be challenging</mark>, and we may not know which ones to extract

Therefore, the next step is to <mark>learn them ourselves</mark> using deep learning...

## Debugging ML Algorithms

There are many ways to debug an ML algorithm, including:

- Getting <mark>more training data</mark>
  - This is potentially very time consuming and expensive
- Changing the <mark>feature set</mark>
  - Removing features
  - Adding new features or combinations of features
- Changing <mark>regularisation</mark> (e.g. $\lambda$)
  - Increase
  - Decrease
- Change the <mark>model's flexibility</mark> (e.g. degree of polynomial)
  - Increase
  - Decrease

This should be done systematically

Some diagnostics which can be done to try and get an idea of what is not working are:

- Evaluation prediction performance:
  - <mark>Cross Validation</mark>
  - Split data into <mark>test/train set</mark>
  - Define a <mark>performance measure</mark>
- Diagnose bias vs variance

Learning curves are also useful, where you plot errors against training size

There is a high bias if you have high training and test errors

There is high variance if you have low training but high test error

To fix high bias, you could try:

- Adding <mark>more features</mark> (as it's probably underfitting)
- <mark>Decreasing regularisation</mark> (to make it less smooth as it's underfitting)
- <mark>Increasing the degree of the polynomial</mark> (more params to stop underfitting)

To fix high variance, you could try:

- Getting <mark>more training data</mark>
- <mark>Removing features</mark> (as it's probably overfitting)
- <mark>Increasing regularisation</mark> (to make it smoother as it's overfitting)
- <mark>Decreasing the degree of the polynomial</mark> (less params to stop overfitting)
