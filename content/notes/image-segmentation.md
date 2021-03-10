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

It's where you split an image into regions

A segmented region is also assigned a semantic meaning, e.g. in a body scan: 'liver' or 'kidney'

It's useful for:

- Quantitative analyses (e.g. measuring volume of the ventricular cavity)
- Determining precise location and extent of an organ or certain type of tissue (e.g. a tumour)
- Creating 3D models used for simulation

## Challenges

- Noise
- Partial volume effects (due to coarse sampling, where pixels not aligned with object boundary)
- Intensity inhomogeneities (varying contrast and intensities across te image plane)
- Anisotropic resolution (different resolutions on different axis, common 3D scans in z plane)
- Imaging artifacts (can be caused e.g. by metal in a CT scan)
- Limited contrast (where different tissues have similar physical properties and thus intensity values)
- Morphological variability (hard to incorporate meaningful prior information)

## Evaluating Image Segmentation

### Ground Truth

This is the reference a method can be compared against

In practice, they are hard to obtain (especially in large volumes)

Instead, they can be made up using synthetic or simulated phantoms, or physical phantoms

### Gold Standard

This is a segmentation manually annotated by a human expert

However, getting these has disadvantages:

- It requires training
- Is tedious and time consuming
- Intra-observer variability (disagreement between same observer on different occasions)
- Inter-observer variability (disagreement between observers)

These can be remedied by:

- Human observer can perform the same segmentation multiple times
- A number of experts can perform segmentation
- Agreement/disagreement can be quantified

### How to Assess Performance?

- Precision
  - is a description of random errors, a measure of statistical variability
  - the repeatability/reproducibility of the measurement
- Accuracy
  - a description of systematic errors, a measure of statistical bias
- Robustness
  - degredation in performance with respect to varying noise levels or other imaging artefacts

There are several ways of quantifying segmentation performance, in terms of agreement of its result with a reference gold standard

A confusion matrix plots the true conditions against the predicted conditions, producing 4 cells:

- True Positive (a hit)
- True Negative (a correct rejection)
- False Positive (a false alarm / type I error)
- False Negative (a miss / type II error)

From these, you can calculate many metrics, such as:

- Accuracy = $\frac{TP + PN}{P + N}$
- Precision = $\frac{TP}{TP + FP}$
- Recall = $\frac{TP}{P}$
- Specificity = $\frac{TN}{N}$

In semantic segmentation, accuracy and specificity aren't really used, as if you add more background they just increase

Therefore using precision and recall, you cal calculate the F1 score = $\frac{2TP}{2TP+FP+FN}$

Overlap of reference and predicted segmentation is another evaluation method

Jaccard Index can be calculated by $\frac{|A \cap B|}{|A \cup B|}$

Dice's Coefficient can be calculated by $\frac{2|A \cap B|}{|A| + |B|}$

Dice's Coefficient is the most widely used measure for evaluating segmentation, and it is equivalent to F1 score

However, som weaknesses are that translations and deformations can give the same score, so it's insensitive to shape changes

Some other measures are:

- Volume similarity = $1 - \frac{||A|-|B||}{|A|+|B|}$ = $1 - \frac{|FN - FP|}{2TP+FP+FN}$
- Surface distance measures, such as:
  - Hausdorff distance = $max(h(A,B), h(B,A))$ where $h(A,B) = \max\limits_{a \in A} \min\limits_{b \in B} ||a-b||$
  - Average surface distance = $\frac{d(A,B)+d(B,A)}{2}$ where $d(A,B) = \frac{1}{N}\sum_{a\in A} \min\limits_{b \in B} ||a-b||$

## Segmentation Algorithms and Techniques

### Thresholding

This is where you select a threshold on the intensity range

There is also UL thresholding where you select an upper AND a lower threshold

Advantages:

- Fast
- Simple

Disadvantages:

- Regions must be homogeneous and distinct
- Difficulty in finding consistent thresholds across images
- Leakages, isolated pixels and 'rough' boundaries likely

### Region Growing

This is where you start from a user selected seed point, and grow a region according to an intensity threshold

Advantages:

- Relatively fast
- Yields connected region

Disadvantages:

- Regions must be homogeneous
- Leakages and 'rough' boundaries likely
- Requires (user) input for seed points

### Graph Cuts

This is where segmentation is based on max-flow/min-cut algorithm

It can take user seed brushes as input, and also has interactive corrections

It can also be used to segment multiple organs simultaneously

Advantages:

- Accurate
- reasonably efficient, interactive

Disadvantages:

- Semi-automatic, requires user input
- Difficult to select tuning parameters

### Atlas-Based Segmentation

An atlas is a prototype or exemplar of the anatomy being segmented

The usually have:

- geometric information about points, curves or surfaces
- label information about voxels

They're usually constructed from example data, from one subject or averaging over multiple

Segmentation using Registration is where atlases are used to propagate labels from atlases to scans by establishing a spatial transformation

Multi-atlas label propagation is where multiple atlases are used to vote on what they think a pixel should be

Advantages:

- Robust and accurate
- Yields plausible segmentations
- Fully automatic

Disadvantages:

- Computationally expensive
- Cannot deal well with abnormalities
- Not suitable for tumour segmentation (as these aren't in atlases)

### Random Forests

These are where many small tests are linked together in a tree to determine between tissue classes

A test will extract some features, compare them to a threshold learned in training, and will follow the appropriate path of the tree

Each leaf will have a decision

Individual trees aren't very powerful as they give a noise output, but multiple combines give an accurate prediction

Advantages:

- Ensemble classifiers are robust and accurate
- Computationally efficient
- fully automatics

Disadvantages:

- Shallow model, no hierarchical features
- No guarantees on correctness

## CNNs for segmentation

Segmentation can be done via dense classification (classification on individual pixels)

However, this is very inefficient as we are doing lots of redundant computations (since we are sliding a window, there is a lot of calculation repeated)

Therefore, instead of having a fully connected layer, we change this to a convolutional layer

This means we can pass in larger images, and we get a feature map out

### Encoder-Decoder Networks

These go beyond image classification (where we predict a class for each pixel)

These produce an output the same size as the input, where the output is the segmentation

This is done using upsampling

An example is U-Net

- This takes an image, and the encoder makes it smaller, until it gets to a low dimension expressive feature map
- This is known as the bottleneck of the architecture
- Then from here, the decoder upsamples the low resolution feature map into an output image gradually
- It also has skip connections between layers of the same size in the encoder and decoder, in order to improve accuracy

### Going Deeper

Deeper networks can represent more complex functions

However, you can't just add more layers, as this uses too many parameters

One way to do this is to only use layers with small kernels, since this reduces the number of parameters

### Multi-Scale Processing

This is where more pathways are added which process downsamples images

A network could take in a normal and low resolution image, and combine the output from both in the middle of the network

From the normal resolution image, it wil learn important patterns

The low resolution input given the ability to incorporate spacial awareness
