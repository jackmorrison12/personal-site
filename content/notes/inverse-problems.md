---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Inverse Problems
slug: inverse-problems
topic: 4.2
hidden: false
tags:
  - Inverse Problems
---

Given the transformation $y = Ax+n$ where:

- $y$ = set of observations
- $A$ = operator
- $x$ = our data
- $n$ = noise

The forward model is $Ax + n$, the inverse model would be trying to recover $x$ from $y$

This can be used in many areas, such as:

- Inpainting
- Deblurring
- Denoising
- Super-resolution
- Medical imaging
- Radat

Lets take deblurring as an example: given a blurry image, we want to restore the high frequency content

The classical approach would be to solve the least squares problem:

$argmin_x \mathcal{D}(Ax, y)$

$\mathcal{D}(Ax, y) = \frac{1}{2}||Ax-y||_2^2$

This is minimising the squared $L^2$ distance between the forward model $Ax$ and observations $y$

The solution is:

$\hat{x} = (A^TA)^{-1}A^Ty$

However, this doesn't work well in practice...

Therefore, we need to add a regularisation term,

$argmin_x \mathcal{D}(Ax, y) + \lambda \mathcal{R}(x)$

$\mathcal{D}(Ax, y) = \frac{1}{2}||Ax-y||_2^2$ and $\mathcal{R}(x) = \frac{1}{2} ||x||_2^2$

Where the regularisation term is the $L^2$ norm of the squared image intensities

The solution with Tikhonov regularisation is now:

$\hat{x} = (A^TA + \lambda I)^{-1}A^Ty$

This is more stable, as it has noise suppression

It conditions the matrix before inversion and suppresses noise

This is the general approach for images, where

$argmin_x \mathcal{D}(Ax, y) + \lambda \mathcal{R}(x)$

- $\mathcal{D}(Ax, y)$ = Data consistency term
- $\mathcal{R}(x)$ = Regularisation term (encoding prior knowledge on x)
- $\lambda$ = Regularisation parameter

Some common regularisers are:

- $\mathcal{R}(x)$ = $||\nabla x||_2^2$ (Tikhonov Regularisation)
- $\mathcal{R}(x)$ = $||\nabla x||_{2,1}$ = $\sum\limits_{i=0}^n \sqrt{\sum\limits_d (|\nabla x|_i^{(d)})^2}$ (Total Variation Regularisation)
- $\mathcal{R}(x)$ = $||\Psi x||_1$ (Wavelet Regularisaton)

However, instead of choosing $\mathcal{R}$ a-priori based on a simple model of image, you can learn \$\mathcal{R} from training data

## Solving Inverse Problems with Deep Learning

There are a few classes of methods:

- Model agnostic (ignores forward model)
- Decoupled (first learn, then reconstruct)
- Unrolled optimisation

### Model Agnostic

An example for this would be training a neural network to solve the inverse problem

This ignores the forward model, and uses a neural network to go from the downsampled image to a higher resolution image

### Partly Model Agnostic

This is where you would first upsample the blurred image using interpolation, to produce a reasonable approximation of the final result, and then refine it with a neural network

### Decoupled

An example of this would be deep proximal gradient

set $\hat{x}^{(1)}$ and stepsize $\eta$

for k = 1,2,...

- $z^k = \hat{x}^{(k)} + \eta A^T (y-A\hat{x}^{(k)})$ (gradient descent)
- $\hat{x}^{(k+1)} = arg \min\limits_x ||z^k -x||_2^2 + \eta \lambda \mathcal{R}(x)$ (denoising)

The second stage can be replaced with a neural net, which takes $z^k$ and returns $\hat{x}^{k+1}$

This neural network can be trained offline, and not during the GD optimisation

Once the neural network is learned, then follow the following formula:

$\mathcal{R}(x)=\begin{cases}0\ x\ \mathsf{on\ image\ manifold}\\ \infty \ \mathsf{otherwise}\end{cases}$

It has learned a manifold which expresses the space of all naturally looking images as a smooth surface in a high dimensional embedding space

It returns 0 if the image is on the manifold, and a large number if not

### Generative Adversarial Networks (GANs)

These are used to learn the image manifold

They take a noise vector sampled from a noise distribution

They convert this to an image, and deef this into a discriminator network

Real images are also fed into this discriminator network

The aim of the generator is to generate real looking images

The aim of the discriminator network is to identify if images are real or synthetic

$\mathcal{D}(x)$ represents the probability that $x$ came from the real data rather then $\mathcal{G}$

$\mathcal{D}$ is trained to maximise the probability of assigning the correct label to both real examples and samples from $\mathcal{G}$

Simultaneously, $\mathcal{G}$ is trained to minimise $log(1-\mathcal{D}(\mathcal{G}(\mathbf{z})))$

So $\mathcal{D}$ and $\mathcal{G}$ play a two-player minimax game with value function $V(\mathcal{G},\mathcal{D})$

$\min\limits_\mathcal{G} \max\limits_\mathcal{D} V(\mathcal{G},\mathcal{D}) = \mathbb{E}_{x\sim p_{data}(x)}[log\mathcal{D}(x)] + \mathbb{E}_{z\sim p_{z}(z)}[log(1-\mathcal{D}(\mathcal{G}(x))]$

You learn the generator $\mathcal{G}$ that outputs $x \in \R^d$ given $x \in \R^{d'}$ for $d' < d$

$\mathcal{R}(x)=\begin{cases}0\ x \in \mathsf{range}(\mathcal{G})\\ \infty \ \mathsf{otherwise}\end{cases}$

You choose $x \in \mathsf{range}(\mathcal{G})$ that best fits the data

$\hat{x} = arg \min\limits_{x \in \mathsf{range}(\mathcal{G})} ||y-Ax||_2^2 = \mathcal{G}(z)$

$\hat{z} = arg \min\limits_{z}||y-A\mathcal{G}(z)||_2^2$

### Unrolled Optimisation

If we assume $\mathcal{R}(x)$ is differentiable,

$argmin_x \mathcal{D}(Ax, y) + \lambda \mathcal{R}(x)$

set $\hat{x}^{(1)}$ and stepsize $\eta$

for k = 1,2,...

- $\hat{x}^{(k+1)} = \hat{x}^{(k)} + \eta A^T(y-A\hat{x}^{(k)}) - \eta \nabla \mathcal{R}(\hat{x}^{(k)})$

Here we are taking the optimisation problem and optimising the objective function using gradient descent

The last term is replaced with a learned NN

This means the unrolled optimisation framework is trained end to end

## Image Super-Resolution

Used to upsample a ow resolution image to a high resolution image

The forward model (from high to low) is straightforward and involves some image degradation followed by downsampling

The inverse model can be based on something like interpolation-based methods

### Post-upsampling super-resolution

This directly upsamples LR image into SR

It requires learning upsampling layers

Advantages:

- Fast
- Low memory requirements

Disadvantages:

- Network has to learn entire upsampling pipeline
- Netowrk typically limited to a specific up-sampling factor

### Pre-upsampling super-resolution

This is a two stage process:

1. First use traditional upsampling algorithm, such as linear interpolation, to obtain SR images
2. Then refine the upsampled images using a deep neural network

Advantages:

- Upsampling operation is performed using interpolation, then correct smaller details with CNN
- Can be applied to a range of upscaling factors and image sizes

Disadvantages:

- Operates on SR image, thus requires more computation and memory

### Progressive upsampling super-resolution

This is a multi-stage process:

- Use a cascade of CNNs to progressively reconstruct higher-resolution images
- at each stage, the images are upsampled to higher resolution and refined by CNNs

Advantages:

- Decomposes complex task into simple tasks
- Reasonable efficiency

Disadvantages:

- Sometime difficult to train very deep models

### Iterative up-and-down sampling super-resolution

Alternate between upsampling and downsampling operations

Mutually connected up- and down-sampling stages

Advantages:

- Has shown superior performance as it allows error feedback
- Easier training of deep networks

### How to implement upsampling

Traditional interpolation-based upsampling can be implemented as a convolutional layer with fixed weights, or using learnable weights as a transpose convolution

### Loss functions for super-resolution

Pixel-wise loss functions (either L1 or L2)

These are very compute and implement, but are not differentiable and penalise outliers very highly

An alternative is the Huber loss function

$\mathcal{L} = \frac{1}{N}\sum\limits_{i=1}^N \delta(x_i - \hat{x}_i)$

Where $\delta(a) = \begin{cases}0.5a^2\ \mathsf{for} |a| \leq 1 \\ |a| - 0.5\ \mathsf{otherwise}\end{cases}$

Perceptual loss is another alternative - this is not pixel wise, it passes images through a pre-trained NN and uses the output at a particular layer - it compares feature activations at that layer in the NN

It means you are comparing feature maps rather than original pixels, which is a more perceptually driven loss function

Total variation take neighbouring pixels, calculates the different, sums the squared differences, and therefore computes the number of edges in the image

It then divides the image to be piecewise constan, and can be used as a regularisation term

You can also have a loss function based on GANs

It aims to detect which images are real, and which are super-resolved (in this case the synthetic ones)

The discriminator output can be used as the loss function - does the image look realistic as a super-resolution image?

It's usually used in combination with other loss functions

## Deep learning for Image Reconstruction

### CT imaging

- High contrast :)
- High spatial resolution :)
- Fast acquisition :)
- Ionising radiation :(

They're generated from rotating an x-ray around the body - this produces a sinogram

CT image to sinogram is the forward problem (an algebraic transformation)

The inverse problem is an inverse radon transform

Given an under-sampled sinogram, out CT image would have striping artifacs

### Magnetic Resonance

- High contrast :)
- High spatial resolution :)
- No ionising radiation :)
- Slow acquisition process :(

This slow acquisition process is ok for static objects, but problematic for moving ones such as the heart

The options are:

- Real time - fast but 2D and relatively poor image quality
- Gated MRI fine for period motion, e.g. respiration or cardiac motion, but requires gating leading to long acquisition times of 30-90 mins

MRI acquisition is performed in k-space by sequentially traversing sample trajectories
