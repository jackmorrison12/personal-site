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

- <mark>Input</mark>:
  - Each input to the neuron ($x_1,...,x_M$) is known as a <mark>feature</mark>
- <mark>Weights</mark>:
  - Each <mark>feature is weighted with a number</mark> to represent the strength of that input ($\theta_1,...,\theta_M$)
- <mark>Activation function</mark>:
  - Calculate the <mark>weighted sum of the inputs</mark> and pass through an <mark>activation function</mark> and <mark>threshold result</mark> to 0 or 1
  - This models the firing rate of a biological neuron

To train a single-layer perceptron, it means <mark>iteratively updating the weights</mark> associated with each of its inputs

This allows it to <mark>progressively approximate the underlying relationship</mark> in the given training dataset

Once properly trained, it can be used to classify entirely new samples

Method:

1. <mark>Initialise the weights and the bias</mark>. Weights may be initialised to 0 or a random small value
2. For each example in our training set X = {$x_1, x_2, ..., x_n $} with labels y = {$y_1, y_2, ..., y_n$}, perform the following steps over the input $x_n$ and desired output $y_n$
   - Calculate the <mark>actual output</mark> $\hat{y}_n = f(x_n^T\theta)$
   - For all features m = 0,...,M <mark>update weights</mark> $\theta_m^{t+1} = \theta_m^t + \tau(y_n - \hat{y}_n)x_{m,n}$, where $\tau$ is the learning rate

If the activation function $f$ is the sigmoid function, then this is just logistic regression

## Multilayer Perceptron

This is where there are <mark>multiple hidden layers</mark>

$\theta^i$ is an (P+1) x Q weight matrix:

- P number of neutrons in layer i
- Q number of neutrons in layer i + 1

$a_j^i$ is the <mark>activation</mark> of neuron j in layer i

$\theta^i$ is the <mark>matrix of weights</mark> controlling the mapping from layer i-1 to layer i

$a^1 = f_a(x^T \cdot \theta^1)$

$a^2 = f_a(a^1 \cdot \theta^2)$

The first layer is multiple logistic regressions with the input features

The last layer is logistic regression with the output of the previous layer as input

## Learning with neural networks

A neural network can have <mark>more than one output class</mark>

For K classes we can use a vector y = ($y_1, ..., y_k$), where:

$y_k = \begin{cases}
 1\ \mathsf{if\ k\ is\ the\ index\ of\ the\ true\ class}\\
 0\ \mathsf{otherwise}
\end{cases}$

This is also known as <mark>one-hot encoding</mark>

The classifier output can also represent <mark>class probabilities</mark>

The <mark>softmax</mark> activation function is used as it <mark>rescales a vector </mark>$a$ using $\hat{y}_k = \frac{exp(a_k)}{\sum_{j=k}^K exp(a_j)}$

The output $\hat{y}$ has two properties:

- All entries <mark>sum to 1</mark>
- All entries in the vector are <mark>non negative</mark>

For the loss function, <mark>cross entropy</mark> is generally used:

In general, the cross entropy of probability distributions p and q is the distance between them

### Generic Optimisation Algorithm

1. <mark>Forward Pass</mark> (Make a prediction and measure the error)
2. <mark>Backward Pass</mark> (Go through each layer in reverse to measure the error contribution from each connection)
3. <mark>Gradient Descent</mark> (Adjust connection weights to reduce the error)

## Activation Functions

Each node in a neural network passes its computation through an <mark>activation function $f_a$</mark>

- This defines the <mark>output of tha node</mark>, or neuron, given an input or set of inputs
- It can be regarded as a transfer function
- It should be a piecewise linear and non-linear activation function

Typically all nodes in the neural network have the <mark>same activation function for each class of neurons</mark>, but activation functions for hidden nodes and output nodes can be different

### <mark>Heaviside</mark> function

$f_a(x) = \begin{cases} 1\ \mathsf{if}\ x > 0 \\ 0\ \mathsf{otherwise}\end{cases}$

- Thresholds at <mark>0</mark>
- Advantages
  - <mark>Simple</mark>
- Disadvantages
  - <mark>Not differentiable</mark>

### <mark>Sigmoid</mark> function

$f_a(x) = \frac{1}{1 + e^{-x}}$

$f'_a(x) = f_a(x)(1-f_a(x))$

- Squashes numbers to range <mark>\[0, 1\]</mark>
- Advantages
  - Historically popular since they have a nice interpretation as a saturating firing rate of a neuron
- Disadvantages
  - Saturated neurons kill gradient (derivative is 0)
  - Sigmoid outputs are <mark>not zero-centered</mark>
  - Exp is compute expensive

### <mark>Tanh</mark> function

$f_a(x) = tanh\ x = \frac{2}{1 + e^{-2x}} - 1$

$f'_a = 1 - f_a(x)^2$

- Scaled version of sigmoid function
- Squashes numbers to range <mark>\[-1, 1\]</mark>
- Advantages
  - Outputs are <mark>zero centered</mark>
- Disadvantages
  - Saturated neurons kill gradients
  - Tanh is <mark>compute expensive</mark>

### <mark>RELU</mark> function

$f_a(x) = max(0, x)$

$f'_a = \begin{cases} 0\ \mathsf{for}\ x < 0 \\ 1\ \mathsf{for}\ x \geq 0  \end{cases}$

- Piecewise linear function
- Advantages
  - Does <mark>not saturate</mark> in + region
  - Very computationally <mark>efficient</mark>
  - Converges much faster than sigmoid/tanh in practice
- Disadvantages
  - <mark>Non zero-centered</mark> output
  - Dead RELUs

### <mark>Leaky RELU</mark> function

$f_a(x) = max(cx, x)$

$f'_a = \begin{cases} c\ \mathsf{for}\ x < 0 \\ 1\ \mathsf{for}\ x \geq 0  \end{cases}$

- Piecewise linear function
- Advantages
  - Does <mark>not saturate</mark>
  - Very computationally efficient
  - Converges much faster than sigmoid/tanh in practice
  - Will <mark>not die</mark>

With a parmetric rectifier (PReLU), we can optimise c via back-propagation

### <mark>ELU</mark> function

$f_a = \begin{cases} x\ \mathsf{if}\ x > 0 \\ \alpha(exp(x)-1)\ \mathsf{if}\ x \leq 0  \end{cases}$

$f'_a = \begin{cases} 1\ \mathsf{if}\ x > 0 \\ f_a(x) + \alpha\ \mathsf{if}\ x \leq 0  \end{cases}$

- Pievewise linear function
- Advantages
  - All benefits of ReLU
  - <mark>Closer to zero mean</mark> outputs
  - Negative saturation regime
  - Compared to Leaky ReLU, adds some <mark>robustness to noise</mark>
- Disadvantages
  - <mark>Compute expensive</mark>

## Stochastic Gradient Descent

For datasets with large N, it's <mark>unfeasible to frequently evaluate the loss function</mark> or its gradient

Instead we use stochastic gradient descent, where it's <mark>approximated from minibatches</mark> of n examples from the training set

If the <mark>learning rate is too high</mark> $\rightarrow$ positive feedback $\rightarrow$ <mark>gradient explodes</mark>

If the <mark>learning rate is too small</mark> $\rightarrow$ negative feedback $\rightarrow$ <mark>gradient vanishes</mark>

## Tips and Tricks

Acquiring more training data is costly and time cosuming, and labelling is even more difficult

### Data <mark>Augementation</mark>

- Generate <mark>new training instances from existing ones</mark>, artificially boosting the size of the training set
- This can be done by:
  - <mark>Geometric transformations</mark> such as rotations, shift, resizing, flip
  - <mark>Pixel transformations</mark> such as brightness or colour changes
  - <mark>Noise</mark>
- Use <mark>domain specific information</mark> for data augmentation
  - E.g. different lighting conditions, occlusions

Augmentations can also be learned

### <mark>Regularisation</mark>

- <mark>Early Stopping</mark>
  - Interrupt training when its performance on the validation set starts dropping
  - This is easy to implement, evaluating the model on the validation set at regular intervals and saving a snapshot result for the next comparison
- <mark>$L^2$ Regularisation</mark>
  - Also known as ridge regression
  - Update cost function by adding another term
- <mark>$L^1$ Regularisation</mark>
  - Also known as lasso regression
  - Update cost function by adding another term
- <mark>Max-norm</mark>
  - For each neuron, the weights $\Theta$ of the incoming connections are constrained such that $||\Theta||_2 \leq r$, where $r$ is the max-norm parameter
  - Compute $||\Theta||_2$ after each training step and clip if needed
- <mark>Dropout</mark>
  - At every training step, every neuron has a probability of being temporarily dropped out
  - Dropout rate typically 0.5

### Weight Initialisaion

It's a <mark>bad idea</mark> to initialise them to a <mark>constant such as 0</mark>, better to make them small random numbers, e.g. from a Normal distribution

### Normalising Data

Data should be <mark>zero-centered</mark> and normalised to have a <mark>standard variance</mark>

This should be done per batch
