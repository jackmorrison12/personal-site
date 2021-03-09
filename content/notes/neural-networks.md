---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Neural Networks
slug: neural-networks
topic: 2.2
hidden: false
tags:
  - Neural Networks
---

## Single Layer Perceptron

- Input:
  - Each input to the neuron ($x_1,...,x_M$) is known as a feature
- Weights:
  - Each feature is weighted with a number to represent the strength og that unput ($\theta_1,...,\theta_M$)
- Activation function:
  - Calculate the weighted sum of the inputs and pass through an activation function and threshold result to 0 or 1
  - This models the firing rate of a biological neuron

To train a single-layer perceptron, it means iteratively updating the weights associated with each of its inputs

This allows it to progressively approximate the underlying relationship in the given training dataset

Once properly trained, it can be used to classify entirely new samples

Method:

1. Initialise the weights and the bias. Weights may be initialised to 0 or a random small value
2. For each example in our training set X = {$x_1, x_2, ..., x_n $} with labels y = {$y_1, y_2, ..., y_n$}, perform the following steps over the input $x_n$ and desired output $y_n$
   - Calculate the actual output $\hat{y}_n = f(x_n^T\theta)$
   - For all features m = 0,...,M update weights $\theta_m^{t+1} = \theta_m^t + \tau(y_n - \hat{y}_n)x_{m,n}$, where $\tau$ is the learning rate

If the activation function $f$ is the gismoid function, then this is just logistic regression

## Multilayer Perceptron

$\theta^i$ is an (P+1) x Q weight matrix:

- P number of neutrons in layer i
- Q number of neutrons in layer i + 1

$a_j^i$ is the activation of neuron j in layer i

$\theta^i$ is the matrix of weights controlling the mapping from layer i-1 to layer i

$a^1 = f_a(x^T \cdot \theta^1)$

$a^2 = f_a(a^1 \cdot \theta^2)$

The first layer is multiple logistic regressions with the input features

The last layer is logistic regression with the output of the previous layer as input

## Learning with neural networks

A neural network can have more than one output class

For K classes we can use a vector y = ($y_1, ..., y_k$), where:

$y_k = \begin{cases}
 1\ \mathsf{if\ k\ is\ the\ index\ of\ the\ true\ class}\\
 0\ \mathsf{otherwise}
\end{cases}$

This is also known as one-hot encoding

The classifier output can also represent class probabilities

The softmax activation function is used as it rescales a vector $a$ using $\hat{y}_k = \frac{exp(a_k)}{\sum_{j=k}^K exp(a_j)}$

The output $\hat{y}$ has two properties:

- All entries sum to 1
- All entries in the vector are non negative

For the loss function, cross entropy is generally used:

In general, the cross entropy of probability distributions p and q is the distance between them

### Generic Optimisation Algorithm

1. Forward Pass (Make a prediction and measure the error)
2. Backward Pass (Go through each layer in reverse to measure the error contribution from each connection)
3. Gradient Descent (Adjust connection weights to reduce the error)

## Activation Functions

Each node in a neural network passes its computation through an activation funcion $f_a$

- This defines the output of tha node, or neuron, given an input or set of nputs
- It can be regarded as a transfer function
- It should be a piecewise linear and nonlinear activation function

Typically all nodes in the neural network have the same activation function for each class of neurons, but activation functions for hidden nodes and output nodes can be different

### Heaviside function

$f_a(x) = \begin{cases} 1\ \mathsf{if}\ x > 0 \\ 0\ \mathsf{otherwise}\end{cases}$

- Thresholds at 0
- Advantages
  - Simple
- Disadvantages
  - Not differentiable

### Sigmoid function

$f_a(x) = \frac{1}{1 + e^{-x}}$

$f'_a(x) = f_a(x)(1-f_a(x))$

- Squashes numbers to range \[0, 1\]
- Advantages
  - Historically popular since they have a n ice interpretation as a saturating firing rate of a neuron
- Disadvantages
  - Saturated neurons kill gradient (derivative is 0)
  - Sigmoid outputs are not zero-centered
  - Exp is compute expensive

### Tanh function

$f_a(x) = tanh\ x = \frac{2}{1 + e^{-2x}} - 1$

$f'_a = 1 - f_a(x)^2$

- Scaled version of sigmoid function
- Squashes numbers to range \[-1, 1\]
- Advantages
  - Outputs are zero centered
- Disadvantages
  - Saturated neurons kill gradients
  - Tanh is compute expensive

### RELU function

$f_a(x) = max(0, x)$

$f'_a = \begin{cases} 0\ \mathsf{for}\ x < 0 \\ 1\ \mathsf{for}\ x \geq 0  \end{cases}$

- Piecewise linear function
- Advantages
  - Does not saturate in + region
  - Very computationally efficient
  - Converges much faster than sigmoid/tanh in practice
- Disadvantages
  - Non zero-centered output
  - Dead RELUs

### Leaky RELU function

$f_a(x) = max(cx, x)$

$f'_a = \begin{cases} c\ \mathsf{for}\ x < 0 \\ 1\ \mathsf{for}\ x \geq 0  \end{cases}$

- Piecewise linear function
- Advantages
  - Does not saturate
  - Very computationally efficient
  - Converges much faster than sigmoid/tanh in practice
  - Will not die

With a parmetric rectifier (PReLU), we can optimise c via back-propagation

### ELU function

$f_a = \begin{cases} x\ \mathsf{if}\ x > 0 \\ \alpha(exp(x)-1)\ \mathsf{if}\ x \leq 0  \end{cases}$

$f'_a = \begin{cases} 1\ \mathsf{if}\ x > 0 \\ f_a(x) + \alpha\ \mathsf{if}\ x \leq 0  \end{cases}$

- Pievewise linear function
- Advantages
  - All benefits of ReLU
  - Closer to zero mean outputs
  - Negative saturation regime
  - Compared to Leaky ReLU, adds some robustness to noise
- Disadvantages
  - Compute expensive

## Stochastic Gradient Descent

For datasets with large N, it's unfeasible to frequently evaluate the loss function or its gradient

Instead we use stochastic gradient descent, where it's approximated from minibatches of n examples from the training set

If the learning rate is too high $\rightarrow$ positive feedback $\rightarrow$ gradient explodes

If the learning rate is too small $\rightarrow$ negative feedback $\rightarrow$ gradient vanishes

## Tips and Tricks

Acquiring more training data is costly and time cosuming, and labelling is even more difficult

### Data Augementation

- Generate new training instances from existing ones, artificially boosting the size of the training set
- This can be done by:
  - Geometric transformations such as rotations, shift, resizing, flip
  - Pixel transformations such as brightness or colour changes
  - Noise
- Use domain specific information for data augmentation
  - E.g. different lighting conditions, occlusions

Augmentations can also be learned

### Regularisation

- Early Stopping
  - Interrupt training when its performance on the validation set starts dropping
  - This is easy to implement, evaluating the model on the validation set at regular intervals and saving a snapshot result for the next comparison
- $L^2$ Regularisation
  - Also known as ridge regression
  - Update cost function by adding another term
- $L^1$ Regularisation
  - Also known as lasso regression
  - Update cost function by adding another term
- Max-norm
  - For each neuron, the weights $\Theta$ of the incoming connections are constrained such that $||\Theta||_2 \leq r$, where $r$ is the max-norm parameter
  - Compute $||\Theta||_2$ after each training step and clip if needed
- Dropout

  - At every training step, every neuron has a probability of being temporarily dropped out
  - Dropout rate typically 0.5

### Weight Initialisaion

It's a bad idea to initialise them to a constant such as 0, better to make them small random numbers, e.g. from a Normal distribution

### Normalising Data

Data should be zero-centered and normalised to have a standard variance

This should be done per batch
