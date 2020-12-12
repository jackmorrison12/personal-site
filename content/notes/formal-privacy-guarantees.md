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

<mark>Protecting a QBS</mark> against all possible attacks is <mark>hard</mark>

The system needs to:

1. Provide an <mark>expressive enough language</mark>/interface to preserve utility
2. Be <mark>robust</mark> to all possible existing and future <mark>attacks</mark>

Consistent (static and dynamic) <mark>noise addition</mark> and <mark>smart QSR</mark> can help, but it's <mark>not sufficient</mark>

However, so far we've assumed an attacker can run as many queries as they want - <mark>we can limit this</mark>

To do this, we could:

1. Count the number of queries and <mark>stop answering when too many have been asked</mark>
2. <mark>Increase the amount of noise we're adding</mark> with each new query

To do this, we need to <mark>quantify how much information we're releasing</mark> with every answer - which is what differential privacy (DP) does!

## What is it?

DP guarantees the <mark>result of a certain query</mark> on the dataset must <mark>be the same irrespective of the presence of any single individual</mark> in the dataset - <mark>one person has no effect on the dataset</mark>

Formally, this is $Pr[output = y | Bob \in D] \approx Pr[output = y | Bob \notin D]$ fo any possible output $y$ and for any arbitrary user

The probability is computed with respect to the randomisation of the algorithm, similar to how the noise was calculated previously

This is a valid privacy definition since it <mark>prevents against attacks</mark>, and <mark>protects sensitive attributes</mark> and the fact that <mark>users are even in the dataset</mark>

We need $\approx$ instead of $=$ above since otherwise we wouldn't be able to depend on anyone being in the dataset

We bound the difference between the dataset with and without a user using $\varepsilon$, such that:

$1 - \varepsilon \lessapprox \frac{Pr[output = y | Bob \in D]}{Pr[output = y | Bob \notin D]} \lessapprox 1 + \varepsilon$

If <mark>$\varepsilon$ is small</mark>, $1 - \varepsilon$ and $1 + \varepsilon$ are close to 1 and the <mark>output with and without Bob will be very similar</mark>

More formally, we use the <mark>notion of a neighbouring dataset</mark> to refer to datasets with ($D1$) and without ($D2$) Bob (or any other users)

<div class="def">
  <span class="is-primary bold">Dataset: </span> A collection of rows, where each row is the record of a different user
</div>

Ue use $\mathbb{D}$ to refer to the <mark>collection of datasets</mark>

Two datasets $D1$ and $D2$ are <mark>neighbouring if they differ by exactly one row</mark>, which means $D1 = D2 \cup \{r\}$, where $r$ is some row

If a mechanism satisfies this, we say it is <mark>$\varepsilon$-Differentially private</mark>

A randomised algorithm $M: \mathbb{D} \rightarrow \R$ is $\varepsilon$-differentially private ($\varepsilon$-dp) if, for any two neighbouring datasets $D$ and $D'$, and for every possible output $y$, we have:

$Pr[M(D) = y] \leq e^{\varepsilon} Pr[M(D') = y]$

This means they're <mark>close enough to each other so that the impact of $y$ on the dataset is minimal</mark>

- $M$ is the algorithm applied to the dataset to <mark>compute both the output, and to ensure privacy</mark>. Here $M$ takes the values in $\R$ for simplicity, but it could be any set
- The <mark>probability space is over the randomisation of $M$</mark>
- By symmetry, we can swap $D$ and $D'$ in the equation. Combining these two equations, we get $e^{-\varepsilon} \leq \frac{Pr[M(D) = y]}{Pr[M(D') = y]} \leq e^{\varepsilon}$
- Since $e^{-\varepsilon} \approx 1 - \varepsilon$ and $e^{\varepsilon} \approx 1 + \varepsilon$ for $\varepsilon \approx 0$, we obtain $1 - \varepsilon \lessapprox \frac{Pr[M(D) = y]}{Pr[M(D') = y]} \lessapprox 1 + \varepsilon$
- If $\varepsilon \approx 0$ we get $Pr[M(D) = y] \approx Pr[M(D') = y]$

The definition ensures that the <mark>output of $M$ will be essentially the same</mark>, independent of whether any individual is in the dataset or not

This is how DP defines privacy - it's an <mark>arbitrary choice</mark>, but one that works well mathematically, and <mark>gives good guarantees to the user</mark>, that their data has no impact

Like a QBS, DP <mark>considers everything to be sensitive</mark> and makes <mark>no distinction between quasi-identifiers and sensitive information</mark>, since you don't know what the attackers has access to

## What does DP not protect against?

DP <mark>protects on the individual level</mark>, and not on a group level, therefore an attacker can <mark>still learn things about groups</mark>

For example, if we're drug testing people over the UK using a DP mechanism, and we compute the percentage of people who test negative for illegal drugs, and we find 99.1% test negative overall, but only 15.5% test negative in South Kensington, then we know people in SK are more likely to take illegal drugs

This is the result of DP not depending on an individual participant

However, for research, <mark>trends in groups is what we usually want to know!</mark>

## Achieving DP

<mark>Adding consistent noise helps protect privacy</mark>

For DP, we generally use <mark>Laplace noise</mark> instead of Gaussian noise

The pdf of a Laplace distribution is:

$f(x|\mu, b) = \frac{1}{2b}exp(-\frac{|x-\mu|}{b})$

Which has a <mark>mean $\mu$</mark> and a <mark>variance $2b^2$</mark>

$Lap(b)$ means a distribution with the pdf $f(x|0,b)$

If we add laplace noise drawn from $Lap(\frac{1}{\varepsilon})$ to the true value, we now need to prove that the mechanism $M$ that returns $Q(D) + Lap(\frac{1}{\varepsilon})$ is $\varepsilon$-dp

The <mark>smaller the $\varepsilon$, the more noise we add</mark>

## DP and Attacks

Using our example from the [QBS notes](/notes/privacy-engineering/query-based-systems), we can have a server with the same set of DoC students which we protect using DP using an $\varepsilon = 0.1$ and the Laplace mechanism (adding noise proportional to $\frac{1}{0.1} = 10$)

If we now <mark>ask a specific question which has one user as the answer</mark>, with one question, our <mark>guess will barely be better than random</mark>

This naturally <mark>thwarts intersection attacks</mark> too without the need for QSR

However, <mark>averaging attacks can still take place</mark> - we're adding noise, but the <mark>central limit theorem</mark> still applies

## Budget

Therefore, to prevent against averaging attacks, we need to decide <mark>how many queries will ever be run on this dataset</mark>, and ensure we are <mark>adding noise proportionally</mark>

So say adding noise proportional to $\varepsilon = 1$ was sufficient to protect someone's privacy for 5 queries, but not 10 - this means we need something called <mark>composability</mark>

This is where <mark>releasing the output</mark> of <mark>any two queries</mark> on a dataset protected by a <mark>$\varepsilon$-dp mechanism</mark> is <mark>equivalent</mark> to releasing <mark>one query protected by a $2\varepsilon$-dp mechanism</mark>

We can then <mark>decide on $\varepsilon$</mark>, which we will call the <mark>privacy budget</mark>, which then <mark>defines the total number of queries anyone can run on the dataset</mark>

This means that <mark>as long as we account for the cost of every query</mark>, we can <mark>spend the budget any way we want</mark>

The <mark>more of the budget we spend</mark> on a query, the <mark>more accurate the result</mark> is

The DP privacy budget can be seen as a <mark>worst case analysis</mark> - even if every query you asked was about a specific user, your <mark>guess</mark> on whether that user was <mark>in the dataset</mark> would <mark>not increase because they were in the dataset</mark>

So even if you <mark>spend your whole budget</mark>, the difference between whether a user is in the dataset or not is <mark>still bounded by $\varepsilon$</mark>

## Utility

In many cases, worst-case analysis requires a <mark>lot of noise to be added</mark>, or to allow everyone to <mark>only ask a small number of questions</mark> before the dataset is destroyed

Therefore, a user needs to <mark>spend their budget as wisely as possible</mark> for the information they need

One way to do this is by using <mark>histograms</mark>

These may be used if we want to compute the <mark>fractions of people</mark> who, for example, use a particular text editor (assuming everyone only uses one)

If we didn't optimise this, then we'd need to do a query for each editor, and then split the budget among all of these, which is not scalable as the number of combinations increases, e.g. if we wanted more bins

Therefore, since <mark>every user in the dataset</mark> only <mark>contributes to one bucket</mark>, it means <mark>removing or adding a single user</mark> from the dataset can <mark>only affect the count of one bucket</mark>

It's easy to prove that this allows us to <mark>not have to split the budget</mark> - we can release the histogram by adding laplace noise of the whole budget to each bucket, so the noise no longer scales with the number of buckets

This can be proved for any sequence of queries where each query is about a vertically disjoint subset of the data

## Function Sensitivity

If we want to not just do counting, for example we want to sum some values, we need something more

For example, if we wanted to find the <mark>sum of all scholarship values</mark> of students born on a specific date, then we could most likely find the value for a particular person

To protect against this, we <mark>add noise proportional to the maximum scholarship</mark> any individual could receive

The <mark>global sensitivity</mark> of a function captures the <mark>magnitude by which a single individual's data can change the function in the worst case</mark>, and therefore, the uncertainty in the response we must introduce to hide anyone's participation

Another example may be with salary - we need to protect the privacy of the very high earners - say the average was £30,000 - if we used noise proportional to this, then it would be very easy to figure out how much people who earned millions earned

Therefore, we now <mark>add noise according to $Lap(\frac{\Delta f }{\varepsilon})$</mark>, where $\Delta f$ is the maximum value in the function

By doing this, we:

- <mark>Protect individuals</mark>, as the answers to specific person queries don't tell us anything useful
- <mark>Allow analysts to ask legitimate questions</mark>, such as "What's the sum of all scholarships", since this value is (hopefully) a lot larger than the highest value, and so the noise is more reasonable (so it indirectly relies on the number of users in the dataset, so the more users the better)

This is <mark>sufficient to prevent an averaging attack</mark>, since the global sensitivity, along with $\varepsilon$ will give us an $\varepsilon$-dp mechanism, since hte noise depends on the query data, as we have more noise if we select a small number of users

## Group Privacy

When it comes to group privacy, DP doesn't protect this as well as it does for individuals - it <mark>degrades linearly with the size of the group</mark> since it is hard to hide a large group

DP guarantees can be extended to groups of size k, but at the cost of <mark>multiplying the noise by a factor of k</mark>

## DP Without Using a Third Party

If we <mark>don't have a trusted third party</mark> to host a QBS, or even collect the data, we can use two Privacy Enhancing Technologies (PETs): Multiparty Computation and Local DP

### Multiparty Computation (MPC)

In MPC the main idea is to have the <mark>users to perform the computation together</mark>, in a distributed fashion

It guarantees cryptographically that no user can learn the data of anyone else, all whilst allowing the anlyst to receive the output

### Local Differential Privacy

Every <mark>user adds noise to their own data locally</mark>, and then <mark>shares this privatised data with the analyst</mark>

The <mark>analyst can then run any computation on this privatised data</mark>

The idea of standard DP is that the output of a dataset should not reveal whether a user belongs in the dataset

In local DP, <mark>participation is no longer a secret</mark> - <mark>the only secret is the response</mark>

An example is a professor who wants to conduct a survey among his students asking "Did you cheat on the exam?"

Every student answers yes or no, following these steps:

1. Flip a biased coin, with probability of tails p > 0.5
2. If tails, then respond truthfully
3. If heads, then lie

This is a <mark>randomised response</mark>, and allows for <mark>plausible deniability</mark>, since you answer may be a lie

The definition and guarantees of local dp are different to the ones of dp - the probability is essentially the same whether your response is $r_1$ or $r_2$

The randomised response is an example of a local dp algorithm, where $\varepsilon = log(\frac{p}{1-p})$

Most real world systems using dp use local dp
