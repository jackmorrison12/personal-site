---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Formal Privacy Guarantees
slug: formal-privacy-guarantees
topic: 4
hidden: false
tags:
  - Formal Privacy Guarantees
  - Differential Privacy
---

# Differential Privacy

Protecting a QBS against all possible attacks is hard

The system needs to:

1. Provide an epressive enough language/interface to preserve utility
2. Be robust to all possible existing and future attacks

Consistent (static and dynamic) noise addition and smart QSR can help, but it's not sufficient

However, so far we've assumed an attacker can run as many queries as they want- we can limit this

To do this, we could:

1. Count the number of queries and stop answering when too many have been asked
2. Increase the amount of noise we're adding with each new query

To do this, we need to quantify how much information we're releasing with every answer - which is what differential privacy (DP) does!

## What is it?

DP guarantees the result of a certain query on the dataset must be the same irrespective of the presence of any single individual in the dataset - one person has no effect on the dataset

Formally, this is $Pr[output = y | Bob \in D] \approx Pr[output = y | Bob \notin D]$ fo any possible output $y$ and for any arbitrary user

The probability is computed with respect to the randomisation of the algorithm, similar to how the noise was calculated previously

This is a valid privacy definition since it prevents against attacks, and protects sensitive attributes and the fact that users are even in the dataset

We need $\approx$ instead of $=$ above since otherwise we wouldn't be able to depend on anyone being in the dataset

Instead, we bound the difference between the dataset with and without bob using $\varepsilon$, such that:

$1 - \varepsilon \lessapprox \frac{Pr[output = y | Bob \in D]}{Pr[output = y | Bob \notin D]} \lessapprox 1 + \varepsilon$

If $\varepsilon$ is small, $1 - \varepsilon$ and $1 + \varepsilon$ are close to 1 and the output with and without Bob will be very similar

More formally, we use the notion of a neighbouring dataset to refer to datasets with ($D1$) and without ($D2$) Bob (or any other users)

<div class="def">
  <span class="is-primary bold">Dataset: </span> A collection of rows, where each row is the record of a different user
</div>

Ue use $\mathbb{D}$ to refer to the collection of datasets

Two datasets $D1$ and $D2$ are neighbouring if they differ by exactly one row, which means $D1 = D2 \cup \{r\}$, where $r$ is some row

If a mechanism satisfies this, we say it is $\varepsilon$-Differentially private

A randomised algorithm $M: \mathbb{D} \rightarrow \R$ is $\varepsilon$-differentially private ($\varepsilon$-dp) if, for any two neighbouring datasets $D$ and $D'$, and for every possible output $y$, we have:

$Pr[M(D) = y] \leq e^{\varepsilon} Pr[M(D') = y]$

This means they're close enough to each other so that the impact of $y$ on the dataset is minimal

- $M$ is the algorithm applied to the dataset to compute both the output, and to ensure privacy. Here $M$ takes the values in $\R$ for simplicity, but it could be any set
- The probability space is over the randomisation of $M$
- By symmetry, we can swap $D$ and $D'$ in the equation. Combining these two equations, we get $e^{-\varepsilon} \leq \frac{Pr[M(D) = y]}{Pr[M(D') = y]} \leq e^{\varepsilon}$
- Since $e^{-\varepsilon} \approx 1 - \varepsilon$ and $e^{\varepsilon} \approx 1 + \varepsilon$ for $\varepsilon \approx 0$, we obtain $1 - \varepsilon \lessapprox \frac{Pr[M(D) = y]}{Pr[M(D') = y]} \lessapprox 1 + \varepsilon$
- If $\varepsilon \approx 0$ we get $Pr[M(D) = y] \approx Pr[M(D') = y]$

The definition ensures that the output of $M$ will be essentially the same, independent of whether any individual is in the dataset or not

This is how DP defines privacy - it's an arbitrary choice, but one that works well mathematically, and gives good guarantees to the user, that their data has no impact

Like a QBS, DP considers everything to be sensitive and makes no distinction between quasi-identifiers and sensitive information, since you don't know what the attackers has access to

## What does DP not protect against?

DP protects on the individual level, and not on a group level, therefore an attacker can still learn things about groups

For example, if we're drug testing people over the UK using a DP mechanism, and we compute the percentage of people who test negative for illegal drugs, and we find 99.1% test negative overall, but only 15.5% test negative in South Kensington, then we know people in SK are more likely to take illegal drugs

This is the result of DP not depending on an individual participant

However, for research, trends in groups is what we usually want to know!

## Achieving DP

Adding consistent noise helps protect privacy

For DP, we generally use Laplace noise instead of Gaussian noise

The pdf of a Laplace distribution is:

$f(x|\mu, b) = \frac{1}{2b}exp(-\frac{|x-\mu|}{b})$

Which has a mean $\mu$ and a variance $2b^2$

$Lap(b)$ means a distribution with the pdf $f(x|0,b)$

If we add laplace noise drawn from $Lap(\frac{1}{\varepsilon})$ to the true value,we now need to prove that the mechanism $M$ that returns $Q(D) + Lap(\frac{1}{\varepsilon})$ is $\varepsilon$-dp

The smaller the $\varepsilon$, the mroe noise we add

## DP and Attacks

Using our example from the [QBS notes](/notes/privacy-engineering/query-based-systems), we can have a server with the same set of DoC students which we protect using DP using an $\varepsilon = 0.1$ and the Laplace mechanism (adding noise proportional to $\frac{1}{0.1} = 10$)

If we now ask a specific question which has one user as the answer, with one question, our guess will barely be better than random

This naturally thwarts intersection attacks too without the need for QSR

However, averaging attacks can still take place, we we're adding noise, but the central limit theorem still applies

## Budget

Therefore, to prevent against averaging attacks, we need to decide how many queries will ever be run on this dataset, and ensure we are adding noise proportionally

So say adding noise proportional to $\varepsilon = 1$ was sufficient to protect someone's privacy for 5 queries, but not 10 - this means we need something called composability

This is where releasing the output of any two queries on a dataset protected by a $\varepsilon$-dp mechanism is equivalent to releasing one query protected by a $2\varepsilon$-dp mechanism

We can then decide on $\varepsilon$, which we will call the privacy budget, which then defines the total number of queries anyone can run on the dataset

This means that as long as we account for the cost of every query, we can spend the budget any way we want

The more of the budget we spend on a query, the more accurate the result is

The DP privacy budget cn be seen as a worst case analysis - even if every query you asked was about a specific user, your guess on whether that user was in the dataset would not increase because they were in the dataset

So even if you spend your whole budget, the difference between whether a user is in the dataset or not is still bounded by $\varepsilon$

## Utility

In many cases, worst-case analysis requires a lot of noise to be added, or to allow everyone to only ask a small number of questions before the dataset is destroyed

Therefore, a user needs to spend their budget as wisely as possible for the information they need

One way to do this is by using histograms

These may be used if we want to compute the fractions of people who, for example, use a particular text editor (assuming everyone only uses one)

If we didn't optimise this, then we'd need to do a query for each editor, and then split the budget among all of these, which is not scalable as the number of combinations increases, e.g. if we wanted more bins

Therefore, since every user in the dataset only contributes to one bucket, it means removing or adding a single user from the dataset can only affect the count of one bucket

It's easy to prove that this allows us to not have to split the budget - we can release the histogram by adding laplace noise of the whole budget to each bucket, so the noise no longer scales with the number of buckets

This can be proved for any sequence of queries where each query is about a vertically disjoint subset of the data

## Function Sensitivity

If we want to not just do counting, for example we want to sum some values, we need something more

For example, if we wanted to find the sum of all scholarship values of students born on a specific date, then we could most likely find the value for a particular person

To protect against this, we add noise proportional to the maximum scholarship any individual could receive

The global sensitivity of a function captures the magnitude by which a single individual's data can change the function in the worst case, and therefore, the uncertainty in the response we must introduce to hide anyone's participation

Another example may be with salary - we need to protect the privacy of the very high earners - say the average was £30,000 - if we used noise proportional to this, then it would be very easy to figure out how much people who earned millions earned

Therefore, we now add noise according to $Lap(\frac{\Delta f }{\varepsilon})$, where $\Delta f$ is the maximum value in the function

By doing this, we:

- Protect individuals, as the answers to specific person queries don't tell us anything useful
- Allow analysts to ask legitimate questions, such as "What's the sum of all scholarships", since this value is (hopefully) a lot larger than the highest value, and so the noise is more reasonable (so it indirectly relies on the number of users in the dataset, so the more users the better)

This is sufficient to prevent an averaging attack, since the global sensitivity, along with $\varepsilon$ will give us an $\varepsilon$-dp mechanism, since hte noise depends on the query data, as we have more noise if we select a small number of users

## Group Privacy

When it comes to group privacy, DP doesn't protect this as well as it does for individuals - it degrades linearly with the size of the group, since it is hard to hide a large group

DP guarantees an eb extended to groups of size k, but at the cost of multiplying the noise by a factor of k

## DP Without Using a Third Party

If we don't have a trusted third party to host a QBS, or even collect the data, we can use two Privacy Enhancing Technologies (PETs): Multiparty Computation and Local DP

### Multiparty Computation (MPC)

In MPC the main idea is to have the users to perform the computation together, in a distributed fashion

It guarantees cryptographically that no user can learn the data of anyone else, all whilst allowing the anlyst to receive the output

### Local Differential Privacy

Every user adds noise to their own data locally, and then shares this privatised data with the analyst

The analyst can then run any computation on this privatised data

The idea of standard DP is that the output of a dataset should not reveal whether a user belongs in the dataset

In local DP, participation is no longer a secret - the only secret is the response

An example is a professor who wants to conduct a survey among his students asking "Did you cheat on the exam?"

Every student answers yes or no, following these steps:

1. Flip a biased coin, with probability of tails p > 0.5
2. If tails, then respond truthfully
3. If heads, then lie

This is a randomised response, and allows for plausible deniability, since you answer may be a lie

The definition and guarantees of local dp are different to the ones of dp - the probability is essentially the same whether your response is $r_1$ or $r_2$

The randomised response is an example of a local dp algorithm, where $\varepsilon = log(\frac{p}{1-p})$

Most real world systems using dp use local dp
