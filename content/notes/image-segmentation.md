---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Image Segmentation
slug: image-segmentation
topic: 3
hidden: false
tags:
  - Image Segmentation
---

## What is Semantic Segmentation?

It's where you <mark>split an image into regions</mark>

A segmented region is also assigned a <mark>semantic meaning</mark>, e.g. in a body scan: 'liver' or 'kidney'

It's useful for:

- <mark>Quantitative analyses</mark> (e.g. measuring volume of the ventricular cavity)
- Determining <mark>precise location</mark> and extent of an organ or certain type of tissue (e.g. a tumour)
- Creating 3D models used for simulation

## Challenges

- <mark>Noise</mark>
- <mark>Partial volume effects</mark> (due to coarse sampling, where pixels not aligned with object boundary)
- <mark>Intensity inhomogeneities</mark> (varying contrast and intensities across te image plane)
- <mark>Anisotropic resolution</mark> (different resolutions on different axis, common 3D scans in z plane)
- <mark>Imaging artifacts</mark> (can be caused e.g. by metal in a CT scan)
- <mark>Limited contrast</mark> (where different tissues have similar physical properties and thus intensity values)
- <mark>Morphological variability</mark> (hard to incorporate meaningful prior information)

## Evaluating Image Segmentation

### Ground Truth

This is the <mark>reference</mark> a method can be compared against

In practice, they are <mark>hard to obtain</mark> (especially in large volumes)

Instead, they can be made up using synthetic or simulated phantoms, or physical phantoms

### Gold Standard

This is a segmentation <mark>manually annotated by a human expert</mark>

However, getting these has disadvantages:

- It requires <mark>training</mark>
- Is tedious and <mark>time consuming</mark>
- <mark>Intra-observer variability</mark> (disagreement between same observer on different occasions)
- <mark>Inter-observer variability</mark> (disagreement between observers)

These can be remedied by:

- Human observer can perform the <mark>same segmentation multiple times</mark>
- A <mark>number of experts</mark> can perform segmentation
- Agreement/disagreement can be quantified

### How to Assess Performance?

- <mark>Precision</mark>
  - is a description of random errors, a measure of statistical variability
  - the repeatability/reproducibility of the measurement
- <mark>Accuracy</mark>
  - a description of systematic errors, a measure of statistical bias
- <mark>Robustness</mark>
  - degredation in performance with respect to varying noise levels or other imaging artefacts

There are several ways of quantifying segmentation performance, in terms of agreement of its result with a reference gold standard

A <mark>confusion matrix</mark> plots the true conditions against the predicted conditions, producing 4 cells:

- True Positive (a hit)
- True Negative (a correct rejection)
- False Positive (a false alarm / type I error)
- False Negative (a miss / type II error)

From these, you can calculate many metrics, such as:

- <mark>Accuracy</mark> = $\frac{TP + PN}{P + N}$
- <mark>Precision</mark> = $\frac{TP}{TP + FP}$
- <mark>Recall</mark> = $\frac{TP}{P}$
- <mark>Specificity</mark> = $\frac{TN}{N}$

In semantic segmentation, accuracy and specificity aren't really used, as if you add more background they just increase

Therefore using <mark>precision and recall</mark>, you cal calculate the <mark>F1 score</mark> = $\frac{2TP}{2TP+FP+FN}$

Overlap of reference and predicted segmentation is another evaluation method

<mark>Jaccard Index</mark> can be calculated by $\frac{|A \cap B|}{|A \cup B|}$

<mark>Dice's Coefficient</mark> can be calculated by $\frac{2|A \cap B|}{|A| + |B|}$

Dice's Coefficient is the most widely used measure for evaluating segmentation, and it is equivalent to F1 score

However, some weaknesses are that translations and deformations can give the same score, so it's <mark>insensitive to shape changes</mark>

Some other measures are:

- <mark>Volume similarity</mark> = $1 - \frac{||A|-|B||}{|A|+|B|}$ = $1 - \frac{|FN - FP|}{2TP+FP+FN}$
- <mark>Surface distance measures</mark>, such as:
  - <mark>Hausdorff distance</mark> = $max(h(A,B), h(B,A))$ where $h(A,B) = \max\limits_{a \in A} \min\limits_{b \in B} ||a-b||$
  - <mark>Average surface distance</mark> = $\frac{d(A,B)+d(B,A)}{2}$ where $d(A,B) = \frac{1}{N}\sum_{a\in A} \min\limits_{b \in B} ||a-b||$

## Segmentation Algorithms and Techniques

### <mark>Thresholding</mark>

This is where you select a threshold on the intensity range

There is also <mark>UL thresholding</mark> where you select an upper AND a lower threshold

Advantages:

- <mark>Fast</mark>
- <mark>Simple</mark>

Disadvantages:

- Regions must be <mark>homogeneous and distinct</mark>
- Difficulty in finding consistent thresholds across images
- Leakages, isolated pixels and 'rough' boundaries likely

### Region Growing

This is where you start from a user selected seed point, and <mark>grow a region according to an intensity threshold</mark>

Advantages:

- Relatively <mark>fast</mark>
- Yields <mark>connected region</mark>

Disadvantages:

- Regions must be <mark>homogeneous</mark>
- Leakages and 'rough' boundaries likely
- Requires (user) input for <mark>seed points</mark>

### <mark>Graph Cuts</mark>

This is where segmentation is based on max-flow/min-cut algorithm

It can take <mark>user seed brushes as input</mark>, and also has interactive corrections

It can also be used to <mark>segment multiple organs simultaneously</mark>

Advantages:

- <mark>Accurate</mark>
- Reasonably <mark>efficient, interactive</mark>

Disadvantages:

- Semi-automatic, requires <mark>user input</mark>
- Difficult to select tuning parameters

### <mark>Atlas-Based Segmentation</mark>

An atlas is a prototype or exemplar of the anatomy being segmented

The usually have:

- <mark>geometric information</mark> about points, curves or surfaces
- <mark>label information</mark> about voxels

They're usually <mark>constructed from example data</mark>, from one subject or averaging over multiple

<mark>Segmentation using Registration</mark> is where atlases are used to propagate labels from atlases to scans by establishing a spatial transformation

<mark>Multi-atlas label propagation</mark> is where multiple atlases are used to vote on what they think a pixel should be

Advantages:

- <mark>Robust and accurate</mark>
- Yields <mark>plausible segmentations</mark>
- Fully <mark>automatic</mark>

Disadvantages:

- Computationally <mark>expensive</mark>
- Cannot deal well with <mark>abnormalities</mark>
- Not suitable for tumour segmentation (as these aren't in atlases)

### Random Forests

These are where <mark>many small tests are linked together</mark> in a tree to determine between tissue classes

A test will extract some features, compare them to a threshold learned in training, and will follow the appropriate path of the tree

Each leaf will have a decision

Individual trees aren't very powerful as they give a noise output, but <mark>multiple combined give an accurate prediction</mark>

Advantages:

- Ensemble classifiers are <mark>robust and accurate</mark>
- Computationally <mark>efficient</mark>
- Fully <mark>automatic</mark>

Disadvantages:

- Shallow model, no hierarchical features
- No guarantees on correctness

## CNNs for segmentation

Segmentation can be done via <mark>dense classification</mark> (classification on individual pixels)

However, this is very <mark>inefficient</mark> as we are doing lots of redundant computations (since we are sliding a window, there is a lot of calculation repeated)

Therefore, instead of having a fully connected layer, we change this to a <mark>convolutional layer</mark>

This means we <mark>can pass in larger images</mark>, and we get a feature map out

### Encoder-Decoder Networks

These go beyond image classification (where we predict a class for each pixel)

These produce an <mark>output the same size as the input</mark>, where the output is the segmentation

This is done using <mark>upsampling</mark>

An example is <mark>U-Net</mark>

- This <mark>takes an image</mark>, and the encoder makes it smaller, until it gets to a <mark>low dimension expressive feature map</mark>
- This is known as the <mark>bottleneck</mark> of the architecture
- Then from here, the decoder upsamples the low resolution feature map into an <mark>output image</mark> gradually
- It also has <mark>skip connections</mark> between layers of the same size in the encoder and decoder, in order to improve accuracy

### Going Deeper

<mark>Deeper networks</mark> can represent more complex functions

However, you can't just add more layers, as this uses too many parameters

One way to do this is to only use <mark>layers with small kernels</mark>, since this reduces the number of parameters

### Multi-Scale Processing

This is where <mark>more pathways</mark> are added which process downsamples images

A network could take in a normal and low resolution image, and combine the output from both in the middle of the network

From the normal resolution image, it wil learn important patterns

The low resolution input given the ability to incorporate spacial awareness
