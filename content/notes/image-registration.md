---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Image Registration
slug: image-registration
topic: 6
hidden: false
tags:
  - Image Registration
---

Images are usually represented as d-dimensional arrays with scalar/vector values

They're represented as a mathematical function $f:\R^d \rightarrow \R^n$, where usually $d=3$, $n=1$, and $f(x,y,z) \in \R$

They also contain meta information such as scale (element spacing), orientation (directions of main axes) and position (image origin)

In many areas such as medical imaging, we need to establish spatial correspondences between images, such as the same point in a CT and MRI scan

## Coordinate Systems

An <mark>image coordinate system</mark> is a pixel-value array

They have axes (e.g. $x$ and $y$), element spacing (e.g. $s_x and s_y$), which can be different for different axes, and a function $f$ which describes the image, mapping a coordinate to it's intensity value

Images are taken with respect to a <mark>world coordinate system</mark>, which is fixed

There is a well-defined origin of the world, and for an image, it has a vector which points from the world origin to the image origin, and then orientation vectors

To convert from image to world, you apply $T_{ItW}$, which first deals with element spacing (scaling), then direction (rotation), and then the origin (shift)

$ \begin{pmatrix}
X \\
Y \\
1 
\end{pmatrix}  =$
$ \begin{bmatrix}
1 & 0 & ox \\
0 & 1 & oy \\
0 & 0 & 1 
\end{bmatrix}  $
$ \begin{bmatrix}
dxx & dyx & 0 \\
dxy & dyy & 0 \\
0 & 0 & 1 
\end{bmatrix}  $
$ \begin{bmatrix}
sx & 0 & 0 \\
0 & sy & 0 \\
0 & 0 & 1 
\end{bmatrix} 
\begin{pmatrix}
x \\
y \\
1 
\end{pmatrix} $

To do the reverse, you just apply the inverse matrix $T_{ItW}^{-1}$ to $ \begin{pmatrix}
X \\
Y \\
1 
\end{pmatrix} $

However, there is more than one world (such as the world of CT scanners, and the world of MRI scanners), and so these lie in a <mark>universal coordinate system</mark>

To go from an image in world B to one in world A, you need to do:

$ \begin{pmatrix} x_A \\ y_A \end{pmatrix}  = T_{WtI}^A T_{BtA} T_{ItW}^B \begin{pmatrix} x_B \\ y_B \end{pmatrix}$

We need to find $T_{BtA}$, which is the transformation from B to A in their world coordinate systems

## Transformation Models

This is how we mathematically express transformations

There are linear transformations:

- Identity \[0 dof\]
- Rigid (rotation + translation) \[3/6 dof for 2D/3D\]
- Similarity (rigid + uniform scaling) \[4/6 dof for 2D/3D\]
- Affine (rigid + nonuniform scaling + shear) \[6/12 dof for 2D/3D\]

And also non-linear transformations

- Deformable \[millions of dof\]

### Linear Transformations

Linear transformations can be parameterised using homogeneous coordinates

For example, a 2D affine transformation would need

- Translation - 2 degrees of freedom (x and y)
- Rotation - 1 degree of freedom (angle)
- Scaling - 2 degrees of freedom (x and y)
- Shearing - 1 degree of freedom (angle)

Shearing is essentially a rotation, an unisotropic scaling, and then rotating back

Each of these are represented by a matrix, and if we multiple them together, then we get one large matrix with 6 degrees of freedom

### Freeform Deformations

This is a low-dimensional deformation model with many degrees of freedom

An object is embedded in a regular grid defined over the image domain

It then applies transformations to some of the control points in that grid

The intermediate points use interpolation to move

A basis function is used in order to figure out how much of each control point transformation influences the neighbouring points, allowing a smooth transformation

Some other deformation models are:

- Control point based models
- Finite-element methods
- Dense displacement fields

## Applications

Some uses of image registration are:

- Satellite imaging (seeing differences over time)
- Point correspondences
- Panoramic image stitching
- Optical flow
- Cardiac motion
- Respiratory motion
- Pre- and post-op scans
- Multi-modal fusion (e.g. different scan types)

Intra-subject registration can also be done, for example by registering a contrasted and non-contrasted image to see the differences, e.g. to isolate a tumour

It can also be used to construct atlases, by using different people's brains and finding the average brain:

- Take in some random subjects' brains
- Select one as the target
- Iteratively do registration:
  - Rigid (to roughly align)
  - Affine (size and scale them)
  - Nonrigid (compensate for shape differences)

You can then do multi-atlas label propagation, which takes in multiple images with segmentations

It then then taken in a new brain, and finds a mapping from the atlas to this brain

Since we have the segmentation for the atlas, we can use the same mapping to map the segmentations onto the new brain

## Intensity-based Registration

The estimation of transformation parameters is driven by the appearance of images

Images are registered when they appear similar

The objective function is:

$C(T) = D(I \cdot T, J)$

Where:

- $C$ is the cost function
- $T$ is the transformation
- $D$ is a dissimilarity measure
- $I \cdot T$ is the input image with the transformation applied (which is going to move)
- $J$ is the fixed, target image

In order to optimise the transformation, we need to optimise:

$\hat{T} = arg \min\limits_{T}C(T)$

So we return the argument $T$ which has the minimum cost value

In mono-modal registration, image intensities are related by a simple function (e.g. same scanner type)

In multi-modal registration, image intensities are related by a complex function ot statistical relationship (e.g. different scanner types)

Some examples of dissimilarity measures are:

Intensity differences:

- Sum of squared differences (SSD)
  - Sensitive to outliers
  - Iterate over all pixels, do intensity of transformed I - intensity of J and square it
- Sum of absolute differences (SAD)
  - It's more robust to outliers
  - Use absolute value instead of square

These assume there is an identity relationship between the intensity distributions, so it is useful for mono-modal registration

- Correlation coefficient
  - Takes into account image statistics (mean and sd)
  - More robust to linear changes
  - Normalised $-1 \leq x \leq 1$

This assumes a linear relationship between intensity distributions, and is also mainly used mor mono-modal registration

For multi-modal registration, we cannot use mathematical models, as there is no linear relationship

So we have to leverage a statistical relationship

For example, if we registered a CT and MRI scan, some areas which are dark in a CT scan may be light in an MRI scan

We can use a 2D intensity histogram to model this, have use bins to take counts

WE can use the joint probability of an image point having a value $i$ in image $I$ and value $j$ in image $J$

$p(i,j) = \frac{h(i,j)}{N}$

We can also have the marginal probabilities of an image points having a value $i$ in image $I$ (and same for $J$):

$p(i) = \sum\limits_j p(i,j)$

We can then use:

- Shannon entropy
  - $h(I) = - \sum\limits_i p(i)log\ p(i)$
  - This is the amount of information contained in image $I$
- Joint entropy
  - $H(I,J) = - \sum\limits_i \sum\limits_j p(i,j) log \ p(i,j)$
  - This is the amount of information contained int he combined image $I,J$
  - This could be used for registration as it measure the amount of info we see in the joint intensity histogram, and we want to find the histogram with the least info, so we could minimise it
  - However, this doesn't work well in practice

Therefore, we use mutual information:

- $MI(I,J) = H(I) + H(J) - H(I,J)$
- Which describes how well one image can be explained bu the other
- This can be rewritten in terms of marginal and joint probabilities:
- $MI(I,J) = \sum\limits_i\sum\limits_j p(i,j) log\frac{p(i,j)}{p(i)p(j)}$
- Then, the dissimilarity measure is defined as $D_{MI}(I \cdot T, J) = - MI(I \cdot T, J)$

We can also use normalised mutual information:

- $NMI(I,J) = \frac{H(I) + H(J)}{H(I,J)}$
- This is independent of the amount of overlap between images (unlike mutual information)
- Then, the dissimilarity measure is defined as $D_{NMI}(I \cdot T, J) = - NMI(I \cdot T, J)$

These assume a statistical relationship between intensity distributions, and can be used for multi-modal registration

Dissimilarity measures are evaluated in the overlapping region of the two images

If the measure is sensitive to the amount of overlap, you need to be careful not to start with too small an overlap, as it may just move images apart during optimisation

This is due to the capture range - if it's too far off, gradient descent won't align them

There can also be local optima, due to the non-convexity of the similarity measure

A workaround for this is to do multi-scale, hierarchical registration

This is where you successively increase the degreed of freedom, and use Gaussian image pyramids

### Iterative Process

So because we're optimising $\hat{T} = arg \min\limits_{T}C(T)$, how do we find the minimum T? With gradient descent!

Image registration is an iterative process

1. It takes in an image $I$, and applied the transformation $T$ (which is initially the identity)
2. Then it takes in image $J$ and uses the similarity measure to evaluate how close the transformed $I$ and $J$ are
3. Then the gradient descent is done to update the transformation
4. Return to first step with updated transformation for $I$

We don't have to use gradient descent, we can also use:

- Stochastic optimisation
- Bayesian optimisation
- Discrete optimisation
- Convex optimisation
- Downhill-simplex

## Registration with Neural Networks

Neural networks are used to overcome the problems with iterative optimisation, such as the slow speed and demanding computation required

### Supervised Learning Approaches

FlowNet is an example of a supervised neural registration approach

It learns optical flow with CNNs

For training, it takes in a pair of images with corresponding ground truth optical flows, and predicts the flow between then

At test time, it can predict flow in real time

It starts with a 6 channel RGb image (2 x 3 channel images)

It then passes through convolutional layers and produces a 2 channel displacement field

It also does upsampling to produce optical flow fields at each layer, similar to a u-net

However, training data is hard to find - usually it has to be simulated (like in the flying chairs dataset)

The second evolution of FlowNet chained several types of networks

It was built to handle large displacements better (as FlowNet 1.0 couldn't really do this)

After each network was passed through, the output flow field would be used to warp an image, and all would be passed to the next network

Subsequent networks correct mistakes from previous networks

There was a separate architecture for smaller displacements - the flow field from this was fused with the chained ones with a few conv layers to produce the final output

Some other alternatives are:

- Nonrigid image registration using multi-scale 3D CNNs
  - Here, it's trained on synthetic deformations
  - Random deformations allow as many training examples as you want

### Unsupervised Learning Approaches

- Spatial Transformer Networks
  - There are a NN component you can plug in to produce a vector of parameters of a spatial transformation T
  - It transforms feature maps by applying a spatial transformer transformation that's been learned onto a FM
  - It automatically rectifies the digits (normalises them spatially) as downstream classification benefits from spatially normalised digits
- End-to-end unsupervised deformable image registration with a CNN
  - This takes in a moving and fixed image, with the goal of making them look similar
  - You extract image features with a NCC and use this to predict the transformation parameters,
  - Then the moving image is warped to look similar to the fixed image
  - Then a similarity metric is run and back propagation is done on the CNN
- An unsupervised learning model for deformable image registration
  - This instead uses a u-net, producing a dense displacement field
  - Then this spatial transform is applied to the moving image
  - Thn the moved image is compared to the fixed one to get the loss function

These can also be combined with auxiliary information:

- VoxelMorph: A learning framework for deformable image registration
  - This is the previous method, but you can incorporate other information such as segmentations
  - These are only needed at train time to help with the loss function
- Learning conditional deformable templates
  - This is a generative model with attributes such as the subject's age
  - It can be used for learning atlases
  - It registers scans together to get the 'average brain'

### Template Registration

TeTrIS: Template transformer networks for image segmentation

- This takes in an image ans a shape prior (e.g. an anatomical segmentation)
- The goal is to learn how to warp the template map to faithfully segment anatomical structures
- Using the prior shapes, it'll find a transformation to best warp the template to the given input

### Structure-Guided Registration

ISTNs: Image-and-spatial transformer networks

- These take into account additional information at training stage
- It's like combining a segmentation network with a registration network with the goal of registration
- It gives good accuracy on certain regions you decide to give information for beforehand

Atlas-ISTNs:

- These are joint segmentation, registration and atlas construction networks
