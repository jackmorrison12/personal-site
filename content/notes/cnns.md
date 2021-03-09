---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: CNNS
slug: cnns
topic: 2.3
hidden: false
tags:
  - CNNs
---

## Deep Learning Revolution

Recently, neural networks have been becoming deeper and deeper

Deep learning combines the two steps of feature extraction and a model into one step, which learn the features at the same time as training the model

## Types of Network

### Fully Connected Network

- Each neuron detects a different pattern
- Too many weights for each neuron
- Features are local - only neighbouring pixels correlated

### Locally Connected Network

- Each neuron detects a different pattern
- Kernel of a neuron means that there are spatially limited connections
- Much more efficient, as each neuron only has a small number of pixels it relies on

If you add shared weights:

- Assume all connections in the first layer have the same weights
- They all extract the same feature at different positions in the image
- Neurons compute the weighted sum of the inputs, which is the convolution

### Convolutional Neural Networks

- These have convolutional layers
  - Multiple feature maps generated, so multiple features detected per layers
  - A layer is perceived as a multi-channel image
  - Deeper layers process the channels of the previous layers
  - Combine previous features to extract more complex representations

## Feature Maps

The size depends on the following:

- Input size along axis j: $i_j$
- Kernel size along axis j: $k_j$
- Zero passing along axis j: $p_j$
- Stride along axis j: $s_j$

The output $o_j$ can be calculated using the formula: $o_j = \lfloor (i_j - k_j + 2p_j)/s_j \rfloor + 1$

We've seen we can learn multiple kernels at once by stacking output feature maps

## Downsampling via Pooling

- Used to reduce the size of deeper layers
- Invariance to small translations
- Contraction forces network to learn high-level features

There are multiple types of pooling, such as max pooling or mean pooling

You can also learn a pooling type via back propagation

## Upsampling

This is done using a transposed convolution

It adds zeros between the feature map, and the blurs it using a learned convolution kernel

## LeNet

This was the first successful application of CNNs to a real world problem

It consisted of:

- Convolution for spatial features
- Subsampling via average pooling
- Activation function: tanh
- Sparse connectivity between S2 and C3
- MLP as final classifier
- Sequence: convolution, subsampling, lnon-linearlity

It led to other architechtures such as:

- AlexNet
  - Has max-pooling and ReLU
  - Stacked convolutional layers
  - Dropout
  - Data augmentation
  - Trained on 2 GPUs
- VGGNet
  - More layers
  - Smaller 3x3 filters on all convolutional layers with stride of 1

## Deeper Networks

CNNs van get very large (lots of parameters)

Therefore, the 'network in a network' approach was taken, putting fully connected layers in between convolutional layers

This allows very deep networks to be built without the number of parameters exploding

Examples are:

- GoogLeNet (Inception V1)
  - 22 layers & global average pooling as final layer
  - Auxiliary classifiers only used during training to improve backwards flow of gradient
  - Inception modules
- Inception V2
- Changed the basic inception layers, replacing 7x7 and 5x5 filters with multiple 3x3 convolutions

However, going deeper isn't always better 

This is due to optimisation difficulties, solvers cannot find the solution when going deeper 

This led to ResNet, which had residual connections jumping over weighted layers, passing x as an identity to the output

This allows networks to go much deeper