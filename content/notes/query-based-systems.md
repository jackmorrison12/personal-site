---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Query-Based Systems
slug: query-based-systems
topic: 3
hidden: false
tags:
  - Query-Based Systems
---

# Introduction

## Current State of Anonymisation

Anonymisation is hard for small data and (probably) impossible for big data

It needs to:

- Protect a dataset against a whole range of attacks, including: Uniqueness, Homogeneity, Semantic, Skewness, Matching (unicity) & Profiling attacks
- ... by anonymising it once and only once
- ... all while preserving utility for all current and future uses

However, we still need to use datasets anonymously...

## Idea: Not Sharing the Data

The goal of anonymous data is to let a user use the data for statistical purposes (in aggregate)

Query-based systems aim at giving researchers and organisations anonymous access to the data without sharing with them the individual-level data

This can be done through:

- Online Interfaces
- SQL Queries
- Verified Algorithms
- etc...

These would only return aggregated data

In short: they come to the QBS and ask questions about the data, which the QBS answers

# Problems & Solutions

We can use the following running example:

Suppose we send a survey to all students in the Imperial Department of Computing (DoC) with the questions:

- What's your gender?
- What's your date of birth?
- Which text editor do you use to code? (This is the 'sensitive' information)

When we pseudonymise the data, it would look like:

| Pseudonymised ID | Gender | DOB        | Text Editor |
| ---------------- | ------ | ---------- | ----------- |
| cfcd208495d565   | M      | 1994-09-23 | Notepad     |
| 1f71e393b38091   | F      | 1993-02-17 | Vim         |
| de03beffeed9da   | F      | 1994-11-05 | Emacs       |
| 7ca579f85a19a    | M      | 1995-05-11 | Atom        |
| ...              | ...    | ...        | ...         |

Some examples may be interested in knowing the answers to the following queries:

1. "How many students born in 1995 code with Notepad?" <-- Counting query
2. "What is the average age of students who do not code with Notepad?"
3. "Among students born in Arch, is Notepad used by more males or females?"

## Problem: Uniqueness Attacks

One problem on the previous example are uniqueness attacks

Assume that you know a student Bob was born on 1994-09-23

Then you can ask "How many students are born on 1994-09-23 and don't code with Notepad?"

If the answer is 0, you can be certain Bob codes with notepad

## Solution: Query (set) Size Restriction (QSR)

The data holder can block uniqueness attacks by imposing a query set size restriction, which would block a query that selects a small set of users

Every query $Q$ includes a logical formula that selects a specific set of users in the dataset $D$ (e.g. `gender = M AND date_of_birth != 1994-09-23`)

We call this set the query set $Q$ on $D$, and denote it with $\{Q\}_D$ (or just $\{Q\}$)

QSR imposes that every query set such that $|\{Q\}_D| < threshold$ is blocked

The choice of the threshold is made by the data curator

For a database $D$, we denote by $Q(D)$ the result of executing $Q$ on $D$

If $Q$ is a counting query, then the size of $\{Q\}_D$ if simply $Q(D)$

## Problem: Intersection Attacks

However, the system is still open to intersection attacks.

Consider the following two counting queries:

- $Q$ = "How many students in DoC code with Notepad?"
- $Q'$ = "How many students in DoC who are not born on 1994-09-23 code with Notepad?"

Both $Q$ and $Q'$ are likely to have answers $A, A' > threshold$, and so won't be blocked by QSR

We can fund out that id $A-A'=0$, the Bob does not code with Notepad

Intersection attacks use the answers to multiple queries to learn information about a single individual

Detecting intersection attacks is an NP-hard problem

## Solution 1: Bounded Noise Addition

Instead of blocking queries, we can try to protect privacy by perturbing the output of every query

This is usually done by adding some small random noise to the true value of the query before sending the answer back to the user

An example would be adding noise randomly selected between +2 and -2

If the true value of a query is $A = 583$, the noisy version will be $\tilde{A} = A + noise$

the noise is centred at -, so that the expected value of $\tilde{A}$ is $A$, so $\tilde{A}$ is not biased

However, there are limits to this...

Consider the two queries again:

- $Q$ = "How many students in DoC code with Notepad?"
- $Q'$ = "How many students in DoC who are not born on 1994-09-23 code with Notepad?"

Suppose that $\tilde{A}$ = 584 + 2 = 586 and $\tilde{A}'$ = 583 - 2 = 581

The attacker knows the difference between $A$ and $A'$ is at most 1 (since they knows Bob is the only person in the dataset born on that day) and that the noise is bounded between $[-2, 2]$

Therefore, the attacker knows with certainty that $A = 584$ and $A' = 583$, and therefore that bob uses Notepad

We can't assume the attacker doesn't know the noise mechanism we use

An attacker could also have auxiliary information on multiple people

for example, they may know:

- There are 10 male DoC students born in April 1994
- They all use the same text editor

To find out the text editor they all use, the attacker can send the query "How many male students born in April 1994 code with Notepad?"

If none of them use Notepad, $A = 0$ and $\tilde{A} = [-2, 2]$

If all of them use Notepad, $A = 10$ and $\tilde{A} = [8, 12]$

Since these do not overlap, the attacker can know with certainty whether they all use Notepad or not

## Solution 2: Unbounded Noise Addition

Therefore, a better solution is to use unbounded noise

This removes the 100% certainty given by other attacks

To limit the impact on utility, we ensure:

- Noise is centred at 0, as not to introduce biases
- Large perturbations are possible but unlikely

For instance, $\tilde{A} = A + N(0, 1)$, which will preserve utility while resisting the previous attacks

However, if the attacker knows we're adding Gaussian noise centred at 0 with a variance of 1 and that $\tilde{a} = 584$ (true value $a = 583$), while they can't know for sure what the true value is, they can still make a guess

They can use Bayes' rule to compute the posterior belied (assuming the true value is between 0 and 1000)

$Pr[true = x | output = 584] = \frac{Pr[output = 854 | true = x] \times Pr[true = x]}{Pr[output = 584]}$

The result is a discretised normal distribution centred at 584 and truncated outside [0, 1000]

## Problem: Averaging Attacks

While the system has to allow people to ask multiple queries, we add independent Gaussian noise with $\sigma = 1$ to all queries

However, nothing prevents the attacker from asking the same question multiple times and taking the average to find the correct value

These are called averaging attacks

Intuitively, the more the attacker asks the same question, the more samples they collect, and the more accurate their estimate becomes

This can be done in two ways (frequentist and Bayesian):

1. Compute the average of the samples and apply the central limit theorem, which says this average converges to the mean
2. Use Bayes' rule with multiple observations, which immediately gives not only the most likely value, but also the full posterior distribution

An attacker can now run the Bayesian averaging attack to discover "How many students in DoC code with Notepad?

This can then be combined with other queries in an intersection attack to learn whether Bob uses Notepad

As we collect more evidence:

- The mean of the continuous distribution gets closer to the true value
- The variance (the uncertainty on the true value) decreases

So averaging attacks allow us to cancel out the noise added by the system, and noise-free answers an be combined in intersection attacks to learn sensitive information

If we assume the QBS adds independent Gaussian noise $N_i \sim Normal(0, \sigma^2)$

An attacker performs $n$ times the query `COUNT(user=Bob)`

To check if Bob is in the dataset, they will need the following number of queries:

If $n \geq 4 \sigma^2 z_\alpha ^2$, then the attack will have confidence $\alpha$ (where $z_\alpha$ is the ($1-\alpha$)-percentile of the standard Gaussian)

So typical values are : $z_0.05 = 1.96$, $z_0.01 = 2.58$

## Solution: Adding Consistent Noise

The previous attack worked because we can ask the same query multiple times and get different noise every time

If our noise was to be consistent we wouldn't learn anything by asking the same question again

This can be achieved through either:

- Caching - basically making sure we cache the noise result (\$\tilde{A}\$) of every query and return this if the same question is asked again
- seeded pseudorandom number generator (PRNG) - in short, we seed our noise generator to ensure that when the query is the same, the exact same noise is added. The seed could be e.g. the hash of all the parameters of the query

PRNG is more robust since:

1. If the cache is full, values are removes, and so users can abuse this
2. It doesn't require a cache to be stored, and can be calculated on the fly, so it more space-efficient

## Problem: Semantic Averaging Attacks

If the query language is expressive enough, there often exist multiple ways to ask the same questions, e.g.:

- "How many male students born in April 1994 code with Notepad?"
- "How many non-female students born between March and May 1994 code with Notepad?"

Both would return the same answer with different noise, bypassing the cache or seeded PRNG, making average attacks possible again

Another way this can be done is through time-shifting

These are approximate semantic attacks, so don't return exactly the same value, but are likely to be close enough

For example, the queries could ask for the number of people in a classroom:

- From 2:00 to 4:00pm
- From 2:01 to 4:00pm
- From 2:00 to 3:59pm
- etc...

While these may not give the exact same answer, it might still be close enough or an attacker to make a really good guess the exact number of people in the classroom

## Solution: Diffix

This is a program developed by a German start-up, which is a "GDPR-grade" anonymisation query-based system providing accurate answers

It gives ananysts an SQL interface adding "sticky noise" using a seeded PRNG to each request

### Static and Dynamic Noise

Diffix supports queries of the form $Q \equiv count(C_1 \land ... \land C_h)$

Where:

- Every condition $C_i$ is an expression of the form "attribute $\square$ value"
- $\square$ can be $ =, \neq, \leq, <, \geq$ or $>$

For each condition, Diffix adds two stick noise values: static noise and dynamic noise

Diffix's output on $Q$ is then:

$\tilde{Q}(D) = Q(D) + \sum_{i=1}^h static[C_i] + \sum_{i=1}^h dynamic_{Q}[C_i]$

Where static noise is noise added for each condition, and dynamic noise is noise added for the set of people touched by the query

### Static Noise

For each condition $C$, the noise value $static[C]$ is generated drawing a random value from $N(0, 1)$. The random value is generated using a PRNG seeded with:

$static\_seed_c = hash(C, salt)$

Observe that this seed depends only on $C$, not on the query $Q$

### Dynamic Noise

The noise value $dynamic_Q [C]$ is generated in the same way but using a different seed that depends also on the query set $\{Q\}$.

Let $\{Q\} = \{uid+1, ... uid_n\}$

Then:

$dynamic\_seed_{C, Q} = hash(static\_seed_C, uid_1, ..., uid_n)$

Observe that this seed depends on both $C$ and the entire query $Q$ (when selecting $\{uid+1, ... uid_n\}$)

### Bucket Suppression (QSR)

Besides sticky noise, Diffix includes another protection called bucket suppression, which is a more sophisticated version of QSR

The idea is to block every query that selects a set of users with a size smaller than a certain threshold

However, the threshold is no longer fixed, but noisy too

If $Q(D) \leq 1$, then the query gets suppressed

If $Q(D) > 1$ then Diffix draws a noisy threshold $T$ from $N(4, \frac{1}{2})$ using the seed:

$threshold_seed = hash(uid_1, ..., uid_n, salt$

If $Q(D) < T$, then the query is suppressed, otherwise the noisy output $\tilde{Q}(D)$ is computed and sent to the analyst

The threshold depends only on the query set $\{Q\}$

### Split Averaging Attacks

An attacker could submit the same pair of queries with different months:

$(Q_{Jan}, Q'_{Jan}), (Q_{Feb}, Q'_{Feb}), ..., (Q_{Dec}, Q'_{Dec})$

As these queries have different noise, the average of $Q_i(D) + Q'_i(D)$ would converge to the right value

However, static noise protects against this type of split averaging attack

All queries contain the same static noise for the condition "code with Notepad":

$\tilde{Q}_i(D) = Q_i(D) + static[month = i] + static[app = Notepad] + dynamic_{Q_i}[month = i] + dynamic_{Q_i}[app = Notepad]$

$\tilde{Q}_i'(D) = Q_i'(D) + static[month \neq i] + static[app = Notepad] + dynamic_{Q_i'}[month = i] + dynamic_{Q_i'}[app = Notepad]$

Meaning that the average of $\{\tilde{Q}_i(D) + \tilde{Q}'_i(D) \}_{i = Jan..Dec}$ converges to

$tot\_notepad + (2 \times static[app = Notepad])$
