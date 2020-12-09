---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Lagrange Interpolation
slug: lagrange
topic: 5.2
hidden: false
tags:
  - Lagrange Interpolation
---

## What is Lagrange Interpolation?

A polynomial $P(x)$ of degree $T$ can be uniquely determined by a set of $T + 1$ (or more) distinct points on the polynomial curve $P(x)$

For $T$ points there are an infinite number of polynomial of degree $T$ that pass through the $T$ points

Also, for any polynomial $P(x)$ of degree up to at most $N - 1$, there exist coefficients $r = (r_1,...r_N)$ called the recombination vector, such that

$P(0) = \sum_{i=1}^N r_i \cdot P(i)$

## How can we use it?

If Alice wants to split and share a secret number, for example $J = 5$, with $N$ other parties, such that $J$ can only be constructed if any two of the parties combine their shares, she needs to generate a random polynomial of degree 1 and then send different values of $P(x)$ to each party

This means any 2 of the parties can reconstruct the polynomial, and then compute the secret number $J = P(0)$

This can be increased arbitrarily with higher degree polynomials

To recompute $P(0)$, we can caluclate:

$P(0) = \sum_{i=1}^{T+1} \delta_i(0) \cdot P(x_j)$ where $\delta_i(0) = \prod_{j=1, j\neq i}^{T+1} \frac{-x_j}{x_i - x_j} = \prod_{j=1, j\neq i}^{T+1} \frac{x_j}{x_j - x_i}$

As we mentioned earlier, there is a unique recombination vector, such that $P(0) = \sum_{i=1}^N r_i \cdot P(i)$ for all polynomials $P(x)$ of degree up to at most $N - 1$ where $r_i = \delta_i(0)$

The same recombination vector works for all polynomials of degree up to at most $N-1$, so anyone can compute it - it's public knowledge
