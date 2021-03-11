---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Object Detection
slug: object-detection
topic: 4.1
hidden: false
tags:
  - Object Detection
---

## What is Object Detection?

It's where you detect multiple objects inside an image

Different instances of the same object will be labelled differently, e.g. multiple dogs will be labelled as dog1 and dog2

It can be classified as a regression problem, but each image will need a different number of outputs (as there are no set number of objects, and you need 4 outputs per object - x, y, width & height)

## Sliding Window

This is where a CNN is applied to every possible crop of the image, and classifier each crops as an object or a background

However, this is WAY too slow, and definitely cannot be used in real time, as you need to test every location and every patch size, as we don't know the size of an object in the image

## Region Proposals

This is where you first find image regions that are likely to contain objects

This must be fast to run, e.g. selective search gives around 2000 proposals in a few seconds

- The idea is to segment an image using superpixels (at multiple levels of scale)
- Group neighbouring superpixels together and across different scales
- Use features in the region to check if it is likely to contain an object of interest
- Only need to test these identified regions for objects

## (Slow) R-CNN

This takes an input image and generates regions of interest from a proposal method

It then warps these image regions to a standard size

Then they each go through a convnet (e.g. AlexNet) to generate the feature set

Then each region is classified using SVMs, and bounding box regressors are applied to get the location and size of the object

What's wrong with it?

- Ad-hoc training objectives
  - Fine-tune network with softmax classifier
  - Train post-hoc linear SVMs and bounding box regressors
- Training is slow and takes a lot of disk space
- Inference is slow - about 47 seconds per image - since every region needs to be passed through a CNN

## Spatial Pyramid Pooling (SPP-net)

Puts the entire image through one cnn

Then get regions of interest from the feature map produced by the CNN

Then have a spatial pyramid pooling layer, feeding into fully connected layers, and then use SVMs to classify regions and bounding box regressors as before

This makes testing fast, as there is only a small amount of computation per region, as most of it is shared in the CNN

However it still inherits the rest of the R-CNNs problems, such as:

- Ad-hoc training objectives
- Slow training, takes a lot of disk space

It also means you cannot update parameters below the SPP layer during training, which is the main drawback

## Fast R-CNN

This is also fast at test time, however unlike the previous networks, it is one end-to-end network that is trained in one stage

It has a higher mean average precision than slow R-CNN and SPP-net

It applies a CNN to the image, and gets RoIs from a proposal method, but then does an RoI pooling layer, which is different to SPP-net

The RoI pooling later divides the projected proposal into a 7x7 grid, and max-pools each cell

This generates a set of features for each region, which are fed into the fully connected layers

It also uses a softmax classifier, as well as bounding-box regressors

Since these use the same features, the multi-task loss can be calculated across them both, and then this can be propagated back throughout the entire network, making back propagation possible

## Faster R-CNN

This is where the CNN itself does the proposals

You insert the region proposal network to predict proposals from features

You can therefore jointly train it all, with 4 losses:

- RPN classify object/not object
- RPN regress box coordinates
- Final classification score (object classes)
- Final box coordinates

This has good speed and accuracy, and is much easier to use

## Mast R-CNN

This is the Faster R-CNN with FCN on RoIs

This can therefore do segmentation for ach region or instance of an object

It labels each pixel in a region as an object or not an object

The different regions mean different instance of the same object can be segmented

## YOLO (You Only Look Once)

Accurate object detection is slow - it takes around 20 seconds to do it on an image with an R-CNN

This is too slow for real-time, like in a self driving car

This improves with Faster R-CNN, down to 140ms per image, however a car can still travel 4 metres in this time

YOLO gets this down to 22ms per image, so the car travels less than a metre

It works by avoiding the region proposal step, so the image passes through once only

- Take entire image
- Run through CNN
- Get a set of object detections
- Threshold the detections

The image is split into a grid - each cell in this grid will predict bounding boxes where the nearest object is, and give it a confidence of being an object

Each cell will also predict a class probability - this is essentially a coarse segmentation of the image

This is conditioned on the object, so what is the probability it is of a certain class if it is an object

These box and class predictions are combined, and outputs bounding boxes with class probabilities attached to them

Finally, non-maximal suppression is performed to get rid of nearby spurious detections, and then thresholding is done to only take bounding boxes with confidence above a certain threshold

This parameterisation fixes the output size - each cell predicts:

- For each bounding box
  - 4 coordinates (x, y, w, h)
  - 1 confidence value
- Some number of class probabilities

Therefore, we can train one network to be a whole detection pipeline

During training, we match the example to the right cell, and adjust that cell's class prediction

We then look at the cells predicted boxes, find the best one, adjust it, and increase the confidence

We also decrease the confidence of other boxes

Some cells don't have any ground truth detections, so we decrease the confidence of all of their boxes - we don't need to adjust the class probabilities or coordinates
as they're irrelevant

It's pre-trained on ImageNet, using SGD with a decreasing learning rate and extensive data augmentation

It works well across a variety of natural images, and also generalises well to new domains
