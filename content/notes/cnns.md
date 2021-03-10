---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: CNNs
slug: cnns
topic: 2.3
hidden: false
tags:
  - CNNs
---

## Deep Learning Revolution

Recently, neural networks have been becoming deeper and deeper

Deep learning <mark>combines</mark> the two steps of <mark>feature extraction and a model</mark> into <mark>one step</mark>, which <mark>learn the features</mark> at the same time as training the model

## Types of Network

### <mark>Fully Connected</mark> Network

- Each neuron detects a different pattern
- Too many weights for each neuron
- Features are local - only neighbouring pixels correlated

### <mark>Locally Connected</mark> Network

- Each neuron detects a different pattern
- Kernel of a neuron means that there are spatially limited connections
- Much more efficient, as each neuron only has a small number of pixels it relies on

If you add <mark>shared weights</mark>:

- Assume all connections in the first layer have the same weights
- They all extract the same feature at different positions in the image
- Neurons compute the weighted sum of the inputs, which is the convolution

### <mark>Convolutional</mark> Neural Networks

- These have convolutional layers
  - Multiple feature maps generated, so multiple features detected per layers
  - A layer is perceived as a multi-channel image
  - Deeper layers process the channels of the previous layers
  - Combine previous features to extract more complex representations

## <mark>Feature Maps</mark>

The size depends on the following:

- <mark>Input</mark> size along axis j: $i_j$
- <mark>Kernel</mark> size along axis j: $k_j$
- <mark>Zero padding</mark> along axis j: $p_j$
- <mark>Stride</mark> along axis j: $s_j$

The output $o_j$ can be calculated using the formula: <mark>$o_j = \lfloor (i_j - k_j + 2p_j)/s_j \rfloor + 1$</mark>

We've seen we can <mark>learn multiple kernels at once</mark> by stacking output feature maps

## <mark>Downsampling</mark> via Pooling

- Used to <mark>reduce the size of deeper layers</mark>
- Invariance to small translations
- Contraction forces network to learn high-level features

There are multiple types of pooling, such as <mark>max pooling or mean pooling</mark>

You can also <mark>learn a pooling type</mark> via back propagation

## Upsampling

This is done using a <mark>transposed convolution</mark>

It adds zeros between the feature map, and the blurs it using a learned convolution kernel

## <mark>LeNet</mark>

This was the first successful application of CNNs to a real world problem

It consisted of:

- <mark>Convolution</mark> for spatial features
- <mark>Subsampling</mark> via average pooling
- Activation function: <mark>tanh</mark>
- <mark>Sparse connectivity</mark> between S2 and C3
- <mark>MLP</mark> as final classifier
- Sequence: convolution, subsampling, lnon-linearlity

It led to other architectures such as:

- <mark>AlexNet</mark>
  - Has max-pooling and ReLU
  - Stacked convolutional layers
  - Dropout
  - Data augmentation
  - Trained on 2 GPUs
- <mark>VGGNet</mark>
  - More layers
  - Smaller 3x3 filters on all convolutional layers with stride of 1

## Deeper Networks

CNNs van get very large (lots of parameters)

Therefore, the <mark>'network in a network'</mark> approach was taken, putting fully connected layers in between convolutional layers

This allows very deep networks to be built without the number of parameters exploding

Examples are:

- <mark>GoogLeNet</mark> (Inception V1)
  - 22 layers & global average pooling as final layer
  - Auxiliary classifiers only used during training to improve backwards flow of gradient
  - Inception modules
- <mark>Inception V2</mark>
  - Changed the basic inception layers, replacing 7x7 and 5x5 filters with multiple 3x3 convolutions

However, going <mark>deeper isn't always better</mark>

This is due to <mark>optimisation difficulties</mark>, solvers cannot find the solution when going deeper

This led to <mark>ResNet</mark>, which had <mark>residual connections jumping over weighted layers</mark>, passing x as an identity to the output

This allows networks to go much deeper
