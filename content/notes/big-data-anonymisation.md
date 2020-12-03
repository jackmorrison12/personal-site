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

- <mark>Large</mark>
- <mark>High dimensional</mark>
- <mark>Automatically collected</mark> as a side effect of our technology (e.g. location)

Therefore, we can't use the standard terminology, assumptions and metrics any more

The data corresponds to a <mark>behavioural trace of an individual</mark>:

- There is <mark>no sensitive attribute</mark> - every data point is potentially sensitive
- There is <mark>no quasi-identifier</mark> - no point or combination of points that clearly identifies every individual

E.g. for location data:

- Every point is potentially sensitive
- No point is special - it can't be assumed to be known or to uniquely identify you

# Unicity

## Uniqueness to Unicity

<mark>Every point</mark> now is both <mark>sensitive</mark>, and a point which <mark>an attacker may know</mark>

However, we <mark>don't assume an attacker knows all of the points</mark>, just a few ($p$) of them

Unicity aims to <mark>quantify the risk of re-identification</mark> in large scale behavioural datasets

Formally, the unicity $\varepsilon _p$ of a dataset is the <mark>average fraction of the users in the dataset that are uniquely identified by $p$ random points</mark> in their trajectory

For example, in location data, how many people we can locate with $p$ points

### Unicity of Mobile Phone Metadata

In a dataset of 1.5 million people over 18 people, it was found that $\varepsilon _4 = 0.95$

This means that <mark>95% of people are unique for 4 points of their trace</mark>

Even with 2 points, more than 50% of people can be identified

To identify everyone in a 10,000 person sample of the 1.5M person dataset, 13 points are needed

### Unicity of Credit Card Data

In dataset of 1.1 million people over 3 months, $\varepsilon _4 = 0.90$

Using <mark>additional information</mark> about the price of the transaction further increased unicity by 22% on average

## Estimating Unicity

Exact unicity is a costly calculation, so we use a procedure which relies on:

- A <mark>random set of 10,000 users</mark>
- ... for which we <mark>draw $p$ points</mark> at random
- ... and figure out whether these points make them unique

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
return |unique_users|/|users|
```

## What does unicity tell us about behaviour?

It measures <mark>what distinguishes a person from everyone else</mark>

E.g. in credit card data, it showed:

- Women are easier to identify than men
- The richer you are, the easier you are to identify

## Generalisation

The idea is to <mark>coarsen the data</mark> by reducing the spatial and temporal resolution

Turns out, <mark>it does help</mark>, as when you decrease the resolution, you increase the number of points needed to identify someone

However, we have <mark>decreasing return</mark>, so even when the data is very coarse, <mark>only a few more points are needed</mark> to uniquely identify a large number of people (it follows a log graph)

Unicity follows the trend:

$\varepsilon \sim (v * h)^{\frac{-p}{100}}$

Where:

- $\varepsilon$ is unicity
- $v$ is spatial resolution
- $h$ is temporal resolution
- $p$ are the number fo points

# Matching Attacks

<mark>Auxiliary information may not directly match</mark> the available information in the dataset

The data could be <mark>noisy, missing, or match several people</mark>

Or the person we're searching for may <mark>not even be in the dataset!</mark>

Matching attacks are implementations of unicity that rely on:

1. A <mark>measure of distance</mark>, measuring how similar two records are
2. A <mark>linking algorithm</mark> to perform the decision based on the metric

## Matching Attacks on Location Data

We can go beyond simple matching of traces with the most points in common

While people move, they perform actions that are recorded in a dataset

We assume the <mark>number of actions</mark> $A(u, l, t)$ a user $u$ performs in a region $l$ and a time interval $t$ is <mark>distributed according to a Poisson distribution</mark> with parameter $\lambda_{(l,t)}$

The first step is for each user $u$ in the identified data set, and each user $v$ in the anonymised dataset, <mark>compute a score describing how close $u$ and $v$ are</mark>

The score is <mark>computed using probabilities under the Poisson assumption</mark>, as:

$w(u,v) = \sum_l \sum_t (log \varphi_{l,t}(u,v))$

Where $\varphi_{l,t}(u,v)$ is the ratio of probabilities of (1) if $u$ and $v$ are the same user, and (2) if they are independent:

$
\frac{P[A_1(u,l,t) = a_1 \land A_2(v,l,t) = a_2 | \sigma_I(u) = v]}{P[A_1(u,l,t) = a_1 \cdot A_2(v,l,t) = a_2]}
$

Where:

- $P[A_1(u,l,t) = a_1 \land A_2(v,l,t) = a_2$ is the probability that <mark>user $u$ has $a_1$ actions AND user $v$ has $a_2$ actions together</mark>...
- $\sigma_I(u) = v$ ... if they are the <mark>same user</mark>
- $P[A_1(u,l,t) = a_1$ is the probability that user <mark>$u$ has $a_1$ actions alone</mark>
- $P[A_2(v,l,t) = a_2$ is the probability that user <mark>$v$ has $a_2$ actions alone</mark>

It's a better match if <mark>one has a lot data points</mark>

The ratio is high if the fact that $u$ and $v$ are the same user makes ($a_1$, $a_2$) more likely than if they were independent users

For instance, if $a_1$ and $a_2$ are particularly large, if $u$ and $v$ are the same user, then the numerator is high, and the the denominator is small

The log likelihood of a matching $\sigma$ is proportional to $\sum_{u, v=\sigma (u)}w(u,v)$

The second step is to <mark>compute the maximum weight matching between the people in U and the people in V</mark>

The complexity to create the graph is O(|U||V|) using the Hungarian algorithm

The overall complexity is O((|U||V|)$^3$)

User the Poisson assumption, the true matching between U and V has maximum expected likelihood

Step 3 is that an <mark>edge is considered a match</mark> only if its score <mark>differs from the second-best score</mark> by <mark>more than $\varepsilon$ times</mark> (eccentricity) the standard deviation of all other possible matches' score (for this user)

# Profiling Attacks

If the data <mark>doesn't overlap timewise</mark>, we can no longer do a matching attack

We need to do a <mark>profiling attack</mark>, where the distance is time independent

These typically <mark>rely on the user's habits and behaviour</mark> in order to reidentify them

The method is:

1. <mark>Extract a profile</mark> of the user in the identified dataset through a profiling distance/algorithm
2. <mark>Compare the profiles</mark> of known user to users in the anonymous dataset to identify them using a linking algorithm

## Profiling Attacks on Location Data

The attack model on location data is to assume you have access to the previous week's mobile phone metadata for a company, with names

If we have the data for this week without identifiers, we need to reidentify the users

We can <mark>represent a person in the dataset by a histogram of their locations</mark>

This assumes the places people go to and the time they spend there is <mark>similar from one week to the next</mark>

The matching algorithm:

1. Computes <mark>histograms in both datasets</mark>
2. Computes the <mark>distance between each pair of histograms</mark>
3. Uses the Hungarian algorithm again to find the <mark>minimal weight matching</mark>

We can use <mark>many distance metrics</mark> to calculate the difference between histograms:

### Jensen-Shannon Divergence

$w_{ji} = D(\Gamma_{x_j} || \frac{1}{2}(\Gamma_{x_i} + \Gamma_{y_i})) + D(\Gamma_{y_i} || \frac{1}{2}(\Gamma_{x_i} + \Gamma_{y_i}))$

This is an information theoretric metric that <mark>measures the (KL) distance from both histograms to their average</mark>

It guarantees <mark>optimal tradeoff between type I and II errors</mark>

### Dot Product

The dot product of the histograms point by point, to <mark>measure how aligned they are</mark>:

$w_{ji}^{dot} = \quad <\Gamma_{x_j}, \Gamma_{y_i}> \quad = \quad \sum_{l=1}^K \Gamma_{x_j}(l)\Gamma_{y_i}(l)$

### Cosine Similarity

The dot product, but <mark>normalised by the norm of the histograms</mark>, to allow for vectors of small norm (which is popular for sparse datasets)

$w_{ji}^{cos} = 1 - \frac{<\Gamma_{x_j}, \Gamma_{y_i}>}{||\Gamma_{x_j}||_2||\Gamma_{y_i}||_2}$

### The L$_1$ distance

This is a <mark>generic distance metric</mark> for vectors

$w_{ji}^{L_1} = ||\Gamma_{x_j} - \Gamma_{y_i}||_1 = \sum_{l=1}^K |\Gamma_{x_j}(l) - \Gamma_{y_i}(l)|$

## Results on Location Data

The proportion of matches found which are correct is <mark>good for small datasets</mark> (up to 10$^3$ people), but <mark>scale poorly</mark>, dropping to ~40% for 10$^4$ people

If you have <mark>data for longer periods of time</mark>, the <mark>accuracy increases fast</mark>, since this allows an attacker to <mark>better estimate a user's behaviour</mark> and capture more of their habits

# Unstructured Data

This is <mark>non-tabular, non-categorical data</mark> - often text

Examples include:

- Tweets
- Emails
- Search queries
- Social graphs
- Browsing data

This data can <mark>very sensitive and hard to anonymise</mark>, but very useful!
