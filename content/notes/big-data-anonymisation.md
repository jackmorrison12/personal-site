---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Big Data Anonymisation
slug: big-data-anonymisation
topic: 2
hidden: false
tags:
  - Big Data
  - Anonymisation
---

# Introduction

Anonymisation is hard

Once we pseudonymise a dataset, we need to:

1. <mark>Protect it against attacks</mark>, such as: uniqueness, homogeneity, semantic and skewness
2. ... by <mark>anonymising it once and only one</mark>
3. ... all while <mark>preserving utility</mark> for all current and future uses!

## What is Big Data?

<div class="def">
  <span class="is-primary bold">Big Data: </span> Extremely large data sets that may be analysed computationally to reveal patterns, trends and associations, especially  relating to human behaviour and interactions
</div>

A looser definition is <mark>any data which doesn't fit in an excel spreadsheet</mark> (like track & trace data 👀)

The data is:

- Large
- High dimensional
- Automatically collected as a side effect of our technology (e.g. location)

Therefore, we can't use the standard terminology, assumptions and metrics any more

The data corresponds to a behavioural trace of an individual:

- There is no sensitive attribute - every data point is potentially sensitive
- There is no quasi-identifier - no point or combination of points that clearly identifies every individual

E.g. for location data:

- Every point is potentially sensitive
- No point is special - it can't be assumed to be known or to uniquely identify you

# Unicity

## Uniqueness to Unicity

Every point now is both sensitive, and a point which an attacker may know

However, we don't assume an attacker knows all of the points, just a few ($p$) of them

Unicity aims to quantify the risk of re-identification in large scale behavioural datasets

Formally, the unicity $\varepsilon _p$ of a dataset is the average fraction of the users in the dataset that are uniquely identified by $p$ random points in their trajectory

For example, in location data, how many people we can locate with $p$ points

### Unicity of Mobile Phone Metadata

In a dataset of 1.5 million people over 18 people, it was found that $\varepsilon _4 = 0.95$

This means that 95% of people are unique for 4 points of their trace

Even with 2 points, more than 50% of people can be identified

To identify everyone in a 10,000 person sample of the 1.5M person dataset, 13 points are needed

### Unicity of Credit Card Data

In dataset of 1.1 million people over 3 months, $\varepsilon _4 = 0.90$

Using additional information about the price of the transaction further increased unicity by 22% on average

## Estimating Unicity

Exact unicity is a costly calculation, so we use a procedure which relies on:

- A random set of 10,000 users
- ... for which we draw $p$ points at random
- ... and whether these points make them unique

```
users = select(D, p, 10000)
for u in users:
  Ip = draw(u, p)
  is_unique = true
  for x in D \ {u}:
    if Ip is subset of x.trace:
      is_unique = false
      break
  if is_unique:
  unique_users = unique_users + {u}
return |unique)users|/|users|
```

## What does unicity tell us about behaviour?

It measures what distinguishes a person from everyone else

e.g. in credit card data, it showed:

- Women are easier to identify than men
- The richer you are, the easier you are to identify

## Generalisation

The idea is to coarsen the data by reducing the spatial and temporal resolution

Turns out, it does help, as when you decrease the resolution, you increase the number of points needed to identify someone

However, we have decreasing return, so even when the data is very coarse, only a few ore points are needed to uniquely identify a large number of people (it follows a log graph)

Unicity follows the trend:

$\varepsilon \sim (v * h)^{\frac{-p}{100}}$

Where:

- $\varepsilon$ is unicity
- $v$ is spatial resolution
- $h$ is temporal resolution
- $p$ are the number fo points

# Matching Attacks

Auxiliary information may not directly match the available information in the dataset

The data could be noisy, missing, or match several people

Or the person we're searching for may not even be in the dataset!

Matching attacks are implementations of uniticy that rely on:

1. A measure of distance, measuring how similar two records are
2. A linking algorithm to perform the decision based on the metric

## Matching Attacks on Location Data

We can go beyond simple matching of traces with the most points in common

While people move, they perform actions that are recorded in a dataset

We assume the number of actions $A(u, l, t)$ a user $u$ performs in a region $l$ and a time interval $t$ is distributed according to a Poisson distribution with parameter $\lambda_{(l,t)}$

The first step is for each user $u$ in the identified data set, and each user $v$ in the anonymised dataset, compute a score describing how close $u$ and $v$ are

The score is computed using probabilities under the Poisson assumption, as:

$w(u,v) = \sum_l \sum_t (log \varphi_{l,t}(u,v))$

Where $\varphi_{l,t}(u,v)$ is the ratio of probabilities of (1) if $u$ and $v$ are the same user, and (2) if they are independent:

$
\frac{P[A_1(u,l,t) = a_1 \land A_2(v,l,t) = a_2 | \sigma_I(u) = v]}{P[A_1(u,l,t) = a_1 \cdot A_2(v,l,t) = a_2]}
$

Where:

- $P[A_1(u,l,t) = a_1 \land A_2(v,l,t) = a_2$ is the probability that user $u$ has $a_1$ actions AND user $v$ has $a_2$ actions together...
- $\sigma_I(u) = v$ ... if they are the same user
- $P[A_1(u,l,t) = a_1$ is the probability that user $u$ has $a_1$ actions alone
- $P[A_2(v,l,t) = a_2$ is the probability that user $v$ has $a_2$ actions alone

It's a better match if one has a lot of deat points

The ratio is high if the fact that $u$ and $v$ are the same user makes ($a_1$, $a_2$) more likely than if they were independent users

For instance, if $a_1$ and $a_2$ are particularly large, if $u$ and $v$ are the same user, then the numerator is high, and the the denominator is small

The log likelihood of a matching $\sigma$ is proportional to $\sum_{u, v=\sigma (u)}w(u,v)$

The second step is to compute the maximum weight matching between the people in U and the people in V

The complexity to create the graph is O(|U||V|) using the Hungarian algorithm

The overall complexity is O((|U||V|)$^3$)

User the Poisson assumption, the true matching between U and V has maximum expected likelihood

Step 2 is that an edge is considered a match only if its score differes from the secon-best score by more than $\varepsilon$ times (eccentricity) the standard deviation of all other possible matches' score (for this user)

# Profiling Attacks

If the data doesn't overlap timewise, we can no loner do a matching attack

We need to do a profiling attack, where the distance is time independent

These typically rely ont he user's habits and behaviour in order to reidentify them

The method is:

1. Extract a profile of the user in the identified dataset through a profiling distance/algorithm
2. Compare the profiles of known user to users in the anonymous dataset to identify them using a linking algorithm

## Profiling Attacks on Location Data

The attack model on location data is to assume you have access to the previous week's mobile phone metadata for a company, with names

If we hae the data for this week without identifiers, we need to reidentify the users

We can represent a person in the dataset by a histogram of their locations

This assumes the places people go to and the time they spend there is similar from one week to the next

The matching algorith,:

1. Computes histograms in both datasets
2. computed the distance between each pair of histograms
3. Use the Hungarian algorithm again to find the minimal weight matching

We can use many distance metrics to calculate the difference between histograms:

### Jensen-Shannon Divergence

$w_{ji} = D(\Gamma_{x_j} || \frac{1}{2}(\Gamma_{x_i} + \Gamma_{y_i})) + D(\Gamma_{y_i} || \frac{1}{2}(\Gamma_{x_i} + \Gamma_{y_i}))$

This is an information theoretric metric that measures the (KL) distance from both histograms to their average

It guarantees optimal tradeoff between type I and II errors

### Dot Product

The dot product of the histograms point by point, to measure how aligned they are:

$w_{ji}^{dot} = <\Gamma_{x_j}, \Gamma_{y_i}> = \sum_{l=1}^K \Gamma_{x_j}(l)\Gamma_{y_i}(l)$

### Cosine Similarity

The dot product, but normalised by the norm of the histograms, to allow for vectors of small norm (which is popular for sparse datasets)

$w_{ji}^{cos} = 1 - \frac{<\Gamma_{x_j}, \Gamma_{y_i}>}{||\Gamma_{x_j}||_2||\Gamma_{y_i}||_2}$

### The L$_1$ distance

This is a generic distance metric for vectors

$w_{ji}^{L_1} = ||\Gamma_{x_j} - \Gamma_{y_i}||_1 = \sum_{l=1}^K |\Gamma_{x_j}(l) - \Gamma_{y_i}(l)|$

## Results on Location Data

The proportion of matches found which are correct is good for small datasets (up to 10$^3$ people), but scale poorly, dropping to ~40% for 10$^4$ people

If you have data for longer periods of time, the accuracy increases fast, since this allows an attacker to better estimate a user's behaviour and capture more of their habits

# Unstructured Data

This is non-tabular, non-categorical data - often text

Examples include:

- Tweets
- Emails
- Search queries
- Social graphs
- Browsing data

This data can very sensitive and hard to anonymise, but very useful!
