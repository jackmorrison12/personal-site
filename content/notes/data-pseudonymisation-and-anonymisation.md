---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: privacy-engineering
title: Data Pseudonymisation and Anonymisation
slug: data-pseudonymisation-and-anonymisation
topic: 1
hidden: false
tags:
  - Pseudonymisation
  - Anonymisation
  - Hashing
  - K-Anonymity
  - l-Diversity
  - t-closeness
---

# Anonymisation

## What is anonymisation?

<div class="def">
  <span class="is-primary bold">Anonymisation: </span> Disassociating an individual's record from their identity in a particular dataset
</div>

The rationale is: if data <mark>cannot be associated with the individual it relates to, it can't harm them</mark>. This is deeply embedded in data protection laws, such a GDPR, HIPAA (US Health Data) an FERPA (US Education Data)

Essentially, if the <mark>data is anonymous, it's no longer personal data</mark>, and so you don't need to follow the rules for handling personal data, you don't need consent to use it, and you can use it for more purposes

# Pseudonymisation

## What is pseudonymisation?

<div class="def">
  <span class="is-primary bold">Psuedonymisation: </span> The removal of direct identifiers in a dataset
</div>

<mark>Direct identifiers</mark> could be things such as name, phone number or address: <mark>anything which uniquely identifies an individual</mark>. It should be replaces by a unique ID which can't be linked back to the person

## Implementations

There are many ways to implement pseudonumisation:

### Correspondence tables

A correspondence table is built by <mark>generating random strings per direct identifier</mark>. These are then <mark>stored in some form of database</mark>

These aren't really used, since it quickly becomes a <mark>lot of work to save it and keep it up to date</mark> as new data is acquired. We also need to make sure there are no collisions, so each generated string is unique

### Secret Formula

This is a <mark>function which maps identifiers (e.g. a phone number) to a pseudonymised ID</mark>. This means we no longer need to remember and update a table

An example of a formula could be:

$$ pseudonymised\_ID = phone\_number \times 17 + 12345 $$

This saves space, however now we also need to <mark>keep the formula secret</mark>. Also, since we have a function, we can plot the results on a graph and find the line of best fit, generating the secret formula

### More complex secret formula

So what about increasing the complexity of the formula? Well it's been proven that more complex computer systems can just <mark>reverse engineer the function</mark>, and so it's not secure

Also other problems are that if you have complex functions, you're more likely to have <mark>collisions</mark>. This is where two IDs map to the same pseudonymised ID

### Hash function

So we need:

- A <mark>deterministic function</mark>
- All possible <mark>outputs to have the same length</mark>
- <mark>Collisions to be unlikely</mark>
- A function which is <mark>fast to compute</mark>
- A function which is <mark>computationally infeasible to invert</mark>

Also known as... a <mark>cryptographic hash function</mark>!

These are designed so that a <mark>small change in input value generates a large jump in output value</mark>

An example function is:

$$ h(k) = \lfloor m \times (ka - \lfloor k \times a \rfloor ) \rfloor $$

Where $k$ is the input and $a$ and $m$ are constant

Some examples of cryptographic has functions are:

- MD5
- SHA
- SHA-3

However, if you know the which has function was used (which can be inferred from the output length), and the size of the input space, you can <mark>build a lookup table</mark>. This is done by iterating over all possible IDs, as seen below:

```
def create_lookup_table(N):

  table = {}

  for id in range(10**N):
    h = hash(id)
    table[h] = id

  return table
```

### Salted hash function

So how do we prevent people building lookup tables? Salt it!

You should <mark>never assume secrecy on the hash function</mark>. However, you can only build a lookup table if you know the input space, and if it's small enough to loop over all possibilities

<div class="def">
  <span class="is-primary bold">Salt: </span> A fixed, secret string of arbitrary length which is added to the identifier before hashing it
</div>

An example of a salt is:

md5("07123456789") $\Longrightarrow$ md5("07123456789 _youwillneverguessthissalt!_")

If the <mark>salt is long enough, it cannot be brute forced</mark>

Now it's a lot harder to create a lookup table. The things an attacker could know are:

- Which hash function was used
- Salt length
- Where the salt is appended
- A data point

However it would still take an <mark>infeasibly long amount of time to build a lookup table</mark>

If you didn't know one of the bits of information above, then it gets even harder!

A long enough and secret salt is virtually impossible to break

# Attacks and Uniqueness

We're trying to protect our data from attacks where the attacker assumes a certain person is in the dataset and wants to <mark>find with certainty their sensitive attribute</mark>

If this can't be done, they can do a probabilistic attack, to find a sensitive attribute which is very likely to be correct

These are called <mark>re-identification attacks</mark>, and leverage the uniqueness of individuals in the dataset

<div class="def margin-5-b">
  <span class="is-primary bold">Uniqueness w.r.t. A: </span> The fraction of the dataset that is uniquely identified by the set A of quasi-identifiers
</div>

## Terminology:

<div class="def margin-5-b">
  <span class="is-primary bold">Direct Identifier: </span> A piece of information that directly identifies a person, such as a phone number
</div>

<div class="def margin-5-b">
  <span class="is-primary bold">Quasi-identifier: </span> A piece of information that does not directly identify a person, e.g. date of birth, but put with other quasi-identifiers could potentially uniquely identify a person
</div>

<div class="def margin-5-b">
  <span class="is-primary bold">Sensitive Information: </span> A piece of information about an individual we're trying to protect, like a disease
</div>

<div class="def">
  <span class="is-primary bold">Auxiliary Information: </span> Information known to an attacker
</div>

## How to fight attacks

### K-anonymity

<div class="def">
  <span class="is-primary bold">K-anonymity: </span> A table is k-anonymous if every record in the table is indistinguishable from at least k-1 other records, with respect to every set of quasi-identifiers
</div>

This means that even if an <mark>attacker knows all possible quasi-identifiers, they can't uniquely identify their target</mark>, as there are at least k people with those quasi-identifiers

<div class="def">
  <span class="is-primary bold">Equivalence Class: </span> A set of records that have the same values for all the quasi-identifiers
</div>

The <mark>minimum size of an equivalence class in a k-anonymised dataset is k</mark>, and the average size is >= k

There are many ways to acheieve k-anonymity:

- Non-Perturbative Methods (data truthfulness):

  - <mark>Generalisation</mark>: replacing attribute values with more general ones
  - <mark>Suppression</mark>: deletion of a column (attribute) or a row (individual)

- Perturbative Methods (potential to lie):
  - <mark>Noise addition</mark>
  - <mark>Data swapping</mark> (swap attributes between individuals, to not affect outcome of data)

When k-anonymising data, it intrinsically requires you to <mark>make the information less precise</mark>, complete and/or accurate, which can be an issue when using the data

To measure the amount of information left in the dataset, and the loss of information resulting from anonymisation, we use <mark>entropy</mark>, defined as:

$$H(D) = - \sum_{i=1}^{k} \frac{\#C_i}{N}log\frac{\#C_i}{N}$$

Where:

- $N$ is the amount of rows in the dataset $D$
- $C_1$,...,$C_k$ are the equivalence classes
- $\#C_i$ incicates the number of rows that belong to $C_i$

The <mark>higher the entropy, the more information is contained in $D$</mark>

Entropy can range between $0$ (everybody has the same quasi-id vector) and $log N$ (nobody has the same quasi-id vector)

If we have a dataset $D_1$ and it's anonymised version $D_2$, we can <mark>compute the ratio $\frac{H(D_2)}{H(D_1)}$ to quantify the loss of information</mark>

So you need to find a <mark>balance between utility and anonymisation</mark> - but you can only release one version of the dataset which has been pseudonymised, since if you released multiple versions, based on the needs of different applications, since they've not been k-anonymised the same way, they can be cross-matched

### $l$-Diversity

<div class="def">
  <span class="is-primary bold">Homogeneity Attack: </span> An attack where individuals in the same equivalence class all have the same sensitive attribute value
</div>

Now, we need another method to prevent against homogeneity attacks. The solution is $l$-diversity

An equivalence class is <mark>$l$-diverse if it contains at least $l$ distinct values for the sensitive attributes</mark>

A table is $l$ diverse if every equivalence class is $l$ diverse

### t-Closeness

<div class="def margin-5-b">
  <span class="is-primary bold">Semantic Attack: </span> When sensitive attributes of individuals in an equivalence class are distinct but semantically similar, e.g. if the diseases for everyone in the equivalence class are different types of cancer, it can be inferred everyone has cancer
</div>

<div class="def">
  <span class="is-primary bold">Skewness Attack: </span> When the distribution of the sensitive attributes in a class is skewed, so for example if in the general population 99% of people test negative for illegal drust, but in an equivalence class, only 15% test negative, I've learned that the probability of someone in this class taking drugs is higher than usual
</div>

To make an equivalence class have t-closeness, the <mark>distance between the distribution of a sensitive attribute in this class and the distribution of this attribute in the whole table cannot be more than a threshold t</mark>

A table has t-closeness if all equivalence classes have t-closeness

However, this can <mark>again impact utility</mark>, since, for example, the likelihood of young women suffering from cardiac diseases has to be the same than the likelihood for old men, which is not good if that is what you are researching!

It also <mark>doesn't always protect from logical attacks</mark>, e.g. being able to narrow a record down by combining quasi-identifiers, since one quasi-identifier implies another

## Issues with anonymisation

You can <mark>only anonymise a dataset once</mark>, including future data

It depends on the applications you are considering

Once the dataset it out... it's out... <mark>there is no pulling it back</mark>

You need to make strong assumptions on:

- What is a <mark>quasi-identifier</mark>
- What is <mark>ok and not ok for an attacker to learn</mark>
- <mark>What could be inferred</mark> which is not available in the dataset
