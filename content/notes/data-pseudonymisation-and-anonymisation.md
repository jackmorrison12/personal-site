---
type: note
baseurl: /notes/
fullurl: " "
course: privacy-engineering
title: Data Pseudonymisation and Anonymisation
slug: data-pseudonymisation-and-anonymisation
topic: 1
hidden: false
tags:
  - Pseudonymisation
  - Anonymisation
---

# Anonymisation

## What is anonymisation?

<div class="def">
  <span class="is-primary bold">Anonymisation: </span> Disassociating an individual's record from their identity in a particular dataset
</div>

The rationale is: if data cannot be associated with the individual it relates to, it can't harm them. This is deeply embedded in data protection laws, such a GDPR, HIPAA (US Health Data) an FERPA (US Education Data).

Essentially, if the data is anonymous, it's no longer personal data, and so you don't need to follow the rules for handling personal data, you don't need consent to use it, and you can use it for more purposes.

# Pseudonymisation

## What is pseudonymisation?

<div class="def">
  <span class="is-primary bold">Psuedonymisation: </span> The removal of direct identifiers in a dataset
</div>

Direct identifiers could be things such as name, phone number or address: anything which uniquely identifies an individual. It should be replaces by a unique ID which can't be linked back to the person.

## Implementations

There are many ways to implement pseudonumisation:

### Correspondence tables

A correspondence table is built by generating random strings per direct identifier. These are then stored in some form of database.

These aren't really used, since it quickly becomes a lot of work to save it and keep it up to date as new data is acquired. We also need to make sure there are no collisions, so each generated string is unique.

### Secret Formula

This is a function which maps identifiers (e.g. a phone number) to a pseudonymised ID. This means we no longer need to remember and update a table.

An example of a formula could be:

$$
pseudonymised\_ID = phone\_number \times 17 + 12345
$$

This saves space, however now we also need to keep the formula secret. Also, since we have a function, we can plot the results on a graph and find the line of best fit, generating the secret formula.

### More complex secret formula

So what about increasing the complexity of the formula? Well it's been proven that more complex computer systems can just reverse engineer the function, and so it's not secure.

Also other problems are that if you have complex functions, you're more likely to have collisions. This is where two IDs map to the same pseudonymised ID.

### Hash function

So we need:

- A deterministic function
- All possible outputs to have the same length
- Collisions to be unlikely
- A function which is fast to compute
- A function which is computationally infeasible to invert

Also known as... a cryptographic hash function!

These are designed so that a small change in input value generates a large jump in output value.

An example function is:

$$
h(k) = \lfloor m \times (ka - \lfloor k \times a \rfloor ) \rfloor
$$

Where $k$ is the input and $a$ and $m$ are constant.

Some examples of cryptographic has functions are:

- MD5
- SHA
- SHA-3

However, if you know the which has function was used (which can be inferred from the output length), and the size of the input space, you can build a lookup table. This is done by iterating over all possible IDs, as seen below:

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

You should never assume secrecy on the hash function. However, you can only build a lookup table if you know the input space, and if it's small enough to loop over all possibilities.

<div class="def">
  <span class="is-primary bold">Salt: </span> A fixed, secret string of arbitrary length which is added to the identifier before hashing it
</div>

An example of a salt it:

$$
md5(``07123456789") \Longrightarrow md5(``07123456789\underline{youwillneverguessthissalt!}")
$$

If the salt is long enough, it cannot be brute forced.

Now it's a lot harder to create a lookup table. The things an attacker could know are:

- Which hash function was used
- Salt length
- Where the salt is appended
- A data point

However it would still take an infeasibly long amount of time to build a lookup table.

If you didn't know one of the bits of information above, then it gets even harder!

A long enough and secret salt is virtually impossible to break.

# Attacks and Uniqueness

We're trying to protect our data from attacks where the attacker assumes a certain person is in the dataset and wants to find with certainty their sensitive attribute.

If this can't be done, they can do a probabilistic attack, to find a sensitive attribute which is very likely to be correct.

These are called re-identification attacks, and everage the uniqueness of individuals in the dataset.

<div class="def margin-5-b">
  <span class="is-primary bold">Uniqueness w.r.t. A: </span> The fraction of the dataset that is uniquely identified by the set A of quasi-identifiers
</div>

## Terminology:

<div class="def margin-5-b">
  <span class="is-primary bold">Direct Identifier: </span> A piece of information that directly identifies a person, such as a phone number
</div>

<div class="def margin-5-b">
  <span class="is-primary bold">Quasi-identifier: </span> A piece if information that does not directly identify a person, e.g. date of birth, but put with other quasi-identifiers could potentially uniquely identify a person
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

This means that even if an attacker knows all possible quasi-identifiers, they can't uniquely identify their target, as there are at least k people with those quasi-identifiers.

<div class="def">
  <span class="is-primary bold">Equivalence Class: </span> A set of records that have the same values for all the quasi-identifiers
</div>

The minimum size of an equivalence class in a k-anonymised dataset is k, and the average size is >= k.

There are many ways to acheieve k-anonymity:

- Non-perturbative methods (data truthfulness):

---

Topics remaining:

- How to achieve K anonymity
- K anonymising whilst preserving utility
- Generalisation

- Homogeneity Attacks
- L - Diversity
- Semantic Attacks
- Skewness Attacks

- t closeness
