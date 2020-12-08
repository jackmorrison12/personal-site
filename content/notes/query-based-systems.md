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

<mark>Anonymisation is hard</mark> for small data and (probably) impossible for big data

It needs to:

- <mark>Protect a dataset</mark> against a whole <mark>range of attacks</mark>, including: Uniqueness, Homogeneity, Semantic, Skewness, Matching (unicity) & Profiling attacks
- ... by <mark>anonymising it once and only once</mark>
- ... all while <mark>preserving utility</mark> for all current and future uses

However, we still need to use datasets anonymously...

## Idea: Not Sharing the Data

The goal of anonymous data is to let a user <mark>use the data for statistical purposes</mark> (in aggregate)

Query-based systems aim at giving researchers and organisations anonymous <mark>access to the data without sharing with them the individual-level data</mark>

This can be done through:

- Online Interfaces
- SQL Queries
- Verified Algorithms
- etc...

These would only <mark>return aggregated data</mark>

In short: they come to the QBS and <mark>ask questions about the data</mark>, which the QBS answers

# Problems & Solutions

We can use the following running example:

Suppose we send a survey to all students in the Imperial Department of Computing (DoC) with the questions:

- What's your gender?
- What's your date of birth?
- Which text editor do you use to code? (This is the 'sensitive' information)

When we <mark>pseudonymise the data</mark>, it would look like:

| Pseudonymised ID | Gender | DOB        | Text Editor |
| ---------------- | ------ | ---------- | ----------- |
| cfcd208495d565   | M      | 1994-09-23 | Notepad     |
| 1f71e393b38091   | F      | 1993-02-17 | Vim         |
| de03beffeed9da   | F      | 1994-11-05 | Emacs       |
| 7ca579f85a19a    | M      | 1995-05-11 | Atom        |
| ...              | ...    | ...        | ...         |

Some examples may be interested in <mark>knowing the answers to the following queries</mark>:

1. "How many students born in 1995 code with Notepad?" <-- <mark>Counting query</mark>
2. "What is the average age of students who do not code with Notepad?"
3. "Among students born in Arch, is Notepad used by more males or females?"

## Problem: Uniqueness Attacks

One problem on the previous example are <mark>uniqueness attacks</mark>

Assume that you know a student <mark>Bob was born on 1994-09-23</mark>

Then you can ask "How many students are born on 1994-09-23 and don't code with Notepad?"

If the answer is 0, you <mark>can be certain</mark> Bob codes with notepad

## Solution: Query (set) Size Restriction (QSR)

The data holder can block uniqueness attacks by imposing a query set size restriction, which would <mark>block a query that selects a small set of users</mark>

Every query $Q$ includes a <mark>logical formula that selects a specific set of users in the dataset</mark> $D$ (e.g. `gender = M AND date_of_birth != 1994-09-23`)

We call this set the <mark>query set</mark> $Q$ on $D$, and denote it with <mark>$\{Q\}_D$</mark> (or just $\{Q\}$)

QSR imposes that every query set such that <mark>$|\{Q\}_D| < threshold$ is blocked</mark>

The choice of the threshold is made by the data curator

For a database $D$, we denote by $Q(D)$ the result of executing $Q$ on $D$

If $Q$ is a counting query, then the size of $\{Q\}_D$ if simply $Q(D)$

## Problem: Intersection Attacks

However, the system is still open to <mark>intersection attacks</mark>

Consider the following two counting queries:

- $Q$ = "<mark>How many students</mark> in DoC code with Notepad?"
- $Q'$ = "<mark>How many students in DoC who are not born on 1994-09-23</mark> code with Notepad?"

Both $Q$ and $Q'$ are likely to have answers $A, A' > threshold$, and so <mark>won't be blocked by QSR</mark>

We can find out that if <mark>$A-A'=0$</mark>, the Bob does not code with Notepad

Intersection attacks <mark>use the answers to multiple queries to learn information about a single individual</mark>

Detecting intersection attacks is an NP-hard problem

## Solution 1: Bounded Noise Addition

Instead of blocking queries, we can try to protect privacy by <mark>perturbing the output of every query</mark>

This is usually done by <mark>adding some small random noise</mark> to the true value of the query before sending the answer back to the user

An example would be adding noise randomly selected between +2 and -2

If the true value of a query is $A = 583$, the noisy version will be $\tilde{A} = A + noise$

The <mark>noise is centred at 0</mark>, so that the <mark>expected value</mark> of $\tilde{A}$ is $A$, so $\tilde{A}$ is <mark>not biased</mark>

However, there are limits to this...

Consider the two queries again:

- $Q$ = "How many students in DoC code with Notepad?"
- $Q'$ = "How many students in DoC who are not born on 1994-09-23 code with Notepad?"

Suppose that $\tilde{A}$ = 584 + 2 = 586 and $\tilde{A}'$ = 583 - 2 = 581

The attacker knows the <mark>difference between $A$ and $A'$ is at most 1</mark> (since they knows Bob is the only person in the dataset born on that day) and that the <mark>noise is bounded between $[-2, 2]$</mark>

Therefore, the <mark>attacker knows with certainty that $A = 584$ and $A' = 583$</mark>, and therefore that bob uses Notepad

We can't assume the attacker doesn't know the noise mechanism we use

An attacker could also have <mark>auxiliary information</mark> on multiple people

For example, they may know:

- There are 10 male DoC students born in April 1994
- They all use the same text editor

To find out the text editor they all use, the attacker can send the query "How many male students born in April 1994 code with Notepad?"

If none of them use Notepad, $A = 0$ and $\tilde{A} = [-2, 2]$

If all of them use Notepad, $A = 10$ and $\tilde{A} = [8, 12]$

Since these <mark>noisy results do not overlap</mark>, the attacker can know with certainty whether they all use Notepad or not

## Solution 2: Unbounded Noise Addition

Therefore, a better solution is to use <mark>unbounded noise</mark>

This <mark>removes the 100% certainty</mark> given by other attacks

To limit the impact on utility, we ensure:

- <mark>Noise is centred at 0</mark>, as not to introduce biases
- <mark>Large perturbations are possible but unlikely</mark>

For instance, <mark>$\tilde{A} = A + N(0, 1)$</mark>, which will preserve utility while resisting the previous attacks

However, if the attacker knows we're adding Gaussian noise centred at 0 with a variance of 1 and that $\tilde{a} = 584$ (true value $a = 583$), while they can't know for sure what the true value is, they <mark>can still make a guess</mark>

They can use <mark>Bayes' rule to compute the posterior belief</mark> (assuming the true value is between 0 and 1000)

$Pr[true = x | output = 584] = \frac{Pr[output = 854 | true = x] \times Pr[true = x]}{Pr[output = 584]}$

The result is a <mark>discretised normal distribution centred at 584</mark> and truncated outside $[0, 1000]$

## Problem: Averaging Attacks

While the system has to allow people to <mark>ask multiple queries</mark>, we add independent Gaussian noise with $\sigma = 1$ to all queries

However, nothing prevents the <mark>attacker from asking the same question multiple times</mark> and <mark>taking the average</mark> to find the correct value

These are called averaging attacks

Intuitively, the <mark>more the attacker asks the same question</mark>, the more samples they collect, and the <mark>more accurate their estimate becomes</mark>

This can be done in two ways (frequentist and Bayesian):

1. Compute the <mark>average of the samples and apply the central limit theorem</mark>, which says this average converges to the mean
2. Use <mark>Bayes' rule with multiple observations</mark>, which immediately gives not only the most likely value, but also the <mark>full posterior distribution</mark>

An attacker can now run the Bayesian averaging attack to discover "How many students in DoC code with Notepad?

This can then be <mark>combined with other queries in an intersection attack</mark> to learn whether Bob uses Notepad

As we <mark>collect more evidenc</mark>e:

- The <mark>mean</mark> of the continuous distribution gets <mark>closer to the true value</mark>
- The <mark>variance</mark> (the uncertainty on the true value) <mark>decreases</mark>

So averaging attacks allow us to <mark>cancel out the noise added by the system</mark>, and noise-free answers an be combined in intersection attacks to learn sensitive information

If we assume the QBS adds independent Gaussian noise $N_i \sim Normal(0, \sigma^2)$

An attacker performs $n$ times the query `COUNT(user=Bob)`

To check if Bob is in the dataset, they will need the following number of queries:

If $n \geq 4 \sigma^2 z_\alpha ^2$, then the attack will have confidence $\alpha$ (where $z_\alpha$ is the ($1-\alpha$)-percentile of the standard Gaussian)

So typical values are : $z_0.05 = 1.96$, $z_0.01 = 2.58$

## Solution: Adding Consistent Noise

The previous attack worked because we can ask the same query multiple times and get different noise every time

If our <mark>noise was to be consistent</mark> we <mark>wouldn't learn anything by asking the same question again</mark>

This can be achieved through either:

- <mark>Caching</mark> - basically making sure we <mark>cache the noise result</mark> (\$\tilde{A}\$) of every query and return this if the same question is asked again
- <mark>Seeded Pseudorandom Number Generator</mark> (PRNG) - in short, we seed our <mark>noise generator</mark> to ensure that when the query is the same, the exact same noise is added. The seed could be e.g. the hash of all the parameters of the query

PRNG is more robust since:

1. If the <mark>cache is full</mark>, values are removes, and so users can abuse this
2. It doesn't require a cache to be stored, and can be calculated on the fly, so it <mark>more space-efficient</mark>

## Problem: Semantic Averaging Attacks

If the query language is expressive enough, there often exist <mark>multiple ways to ask the same questions</mark>, e.g.:

- "How many male students born in <mark>April 1994</mark> code with Notepad?"
- "How many non-female students born <mark>between March and May 1994</mark> code with Notepad?"

Both would return the <mark>same answer with different noise</mark>, bypassing the cache or seeded PRNG, making average attacks possible again

Another way this can be done is through <mark>time-shifting</mark>

These are <mark>approximate semantic attacks</mark>, so don't return exactly the same value, but are likely to be <mark>close enough</mark>

For example, the queries could ask for the number of people in a classroom:

- From 2:00 to 4:00pm
- From 2:01 to 4:00pm
- From 2:00 to 3:59pm
- etc...

While these may not give the exact same answer, it might still be close enough or an attacker to make a really good guess the exact number of people in the classroom

## Solution: Diffix

This is a program developed by a German start-up, which is a <mark>"GDPR-grade" anonymisation query-based system</mark> providing accurate answers

It gives analysts an <mark>SQL interface, adding "sticky noise", using a seeded PRNG</mark>, to each request

### Static and Dynamic Noise

Diffix <mark>supports queries of the form $Q \equiv count(C_1 \land ... \land C_h)$</mark>

Where:

- Every <mark>condition $C_i$</mark> is an <mark>expression</mark> of the form <mark>"attribute $\square$ value"</mark>
- $\square$ can be $ =, \neq, \leq, <, \geq$ or $>$

For each condition, Diffix adds two sticky noise values: <mark>static noise and dynamic noise</mark>

Diffix's output on $Q$ is then:

$\tilde{Q}(D) = Q(D) + \sum_{i=1}^h static[C_i] + \sum_{i=1}^h dynamic_{Q}[C_i]$

Where <mark>static noise is noise added for each condition</mark>, and <mark>dynamic noise is noise added for the set of people touched</mark> by the query

### Static Noise

For each condition $C$, the noise value $static[C]$ is generated <mark>drawing a random value from $N(0, 1)$</mark>. The random value is generated using a PRNG seeded with:

$static\_seed_c = hash(C, salt)$

Observe that this seed <mark>depends only on $C$</mark>, not on the query $Q$

### Dynamic Noise

The noise value $dynamic_Q [C]$ is <mark>generated in the same way but using a different seed</mark> that <mark>depends also on the query set $\{Q\}$</mark>

Let $\{Q\} = \{uid+1, ... uid_n\}$

Then:

$dynamic\_seed_{C, Q} = hash(static\_seed_C, uid_1, ..., uid_n)$

Observe that this <mark>seed depends on both $C$ and the entire query $Q$</mark> (when selecting $\{uid+1, ... uid_n\}$)

### Bucket Suppression (QSR)

Besides sticky noise, Diffix includes another protection called <mark>bucket suppression</mark>, which is a more sophisticated version of QSR

The idea is to <mark>block every query that selects a set of users with a size smaller than a certain threshold</mark>

However, the <mark>threshold is no longer fixed</mark>, but noisy too

If $Q(D) \leq 1$, then the query gets suppressed

If $Q(D) > 1$ then Diffix <mark>draws a noisy threshold $T$ from $N(4, \frac{1}{2})$</mark> using the seed:

$threshold_seed = hash(uid_1, ..., uid_n, salt$

If <mark>$Q(D) < T$</mark>, then the <mark>query is suppressed</mark>, otherwise the <mark>noisy output $\tilde{Q}(D)$ is computed and sent to the analyst</mark>

The <mark>threshold depends only on the query set $\{Q\}$</mark>

### Split Averaging Attacks

An attacker could submit the <mark>same pair of queries with different months</mark>:

$(Q_{Jan}, Q'_{Jan}), (Q_{Feb}, Q'_{Feb}), ..., (Q_{Dec}, Q'_{Dec})$

As these queries have <mark>different noise</mark>, the <mark>average of $Q_i(D) + Q'_i(D)$ would converge to the right value</mark>

However, <mark>static noise protects against this type of split averaging attack</mark>

All queries contain the same static noise for the condition "code with Notepad":

$\tilde{Q}_i(D) = Q_i(D) + static[month = i] + static[app = Notepad] + dynamic_{Q_i}[month = i] + dynamic_{Q_i}[app = Notepad]$

$\tilde{Q}_i'(D) = Q_i'(D) + static[month \neq i] + static[app = Notepad] + dynamic_{Q_i'}[month = i] + dynamic_{Q_i'}[app = Notepad]$

Meaning that the <mark>average of $\{\tilde{Q}_i(D) + \tilde{Q}'_i(D) \}_{i = Jan..Dec}$ converges</mark> to

$tot\_notepad + (2 \times static[app = Notepad])$
