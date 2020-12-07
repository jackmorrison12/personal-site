---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: DNA Storage
slug: dna-storage
topic: 6.2
hidden: false
tags:
  - DNA Storage
---

# Problems with Existing Solutions

80% of enterprise data is cold

Currently, tapes provide the lowest cost/GB for data archives

However tape only has a lifetime of around 10 to 20 years, therefore requires continuous data migration

Therefore, since 60% of archival data is stored longer than 20 years, tape is not feasible

If data is not migrated, then enterprise DBMS archives might soon face obsolescence

One solution was thought to be microfilm, however it was found out that it disintegrates

# DNA Storage

## Why DNA?

DNA is much more dense than other cold storage solutions, meaning it can store a lot more data in a smaller physical footprint

DNA is also a lot more durable – if we remove water and sunlight, and keep it at 10-12°C, it will last for tens to hundreds of years

Most current solutions use silicon, which we are running out of, since it is a finite material

Billions of operations can be run in parallel on DNA

## What is DNA?

DNA is the carrier of genetic instructions

It consists of double, long chains of molecules called nucleotides

There are four different nucleotides: A, T, C & G

Complimentary nucleotides (A & T, C & G) provide stability, because they bind together

## Storage & Processing Information on DNA

Storing information on DNA consists of four stages

1. Encode binary data into nucleotide string
2. Synthesise nucleotides into DNA
3. Sequence the DNA back into nucelotides
4. Decode the nucleotide string back into binary data

Processing data can be done because complimentary pieces of DNA can bind together

### Encoding Information

The first stage is to translate arbitrary data into nucleotides

The goal is to have a compact code in order to minimise the number of nucleotides per bit

An example may be:

`00 --> A`

`01 --> T`

`10 --> C`

`11 --> G`

This in theory requires 0.5 nucleotides per bit

We could even achieve a better ratio with compression

However there are challenges:

- Biological constraints, since you can't have too many of the same type of nuclueotide in a row, as this could cause a potential breakage
- Synthesis and Sequencing are error-prone

In reality, we need something like:

| AGG | CTCAGAT | AGATCTAATT |
| --- | ------- | ---------- |


Where we have the identifier, error correction codes, and then the value

This means, we have around 1 nucleotide per but

### Information Processing

We exploit chemical processes in order to be very parallel:

- Annealing of complimentary nucleotides
- Polymerase chain reaction (PCR) to replicate/amplify DNA sequences
- Loop mediated isothermal amplification (LAMP – content detection)

The purposes of this are:

- Content detection
- Content retrieval through amplification
- Solving combinatorial problems

### Writing Data

#### The Unstructured Way

Dump the database to a binary archive file and encode it

However, this has the limitations of:

- $log_4(\#segments)$ nucleotides reserved for offset
- No point queries supported
- Cannot perform near-molecule data processing

#### Structured Data Layout

This is where we're smart about how data is encoded

- We can do NSM on DNA, where we have one row per oligo
  - We encode row-by-row, and use the PK for indexing (no need for another offset)
- We can also do DSM on DNA - columnset partitioning for large rows
  - This is where we store the PK and the row for multiple rows

This reduces the overhead from $log_4(\#segments)$ to $log_4(cardinality)$, where $\#segs >> cardinality$

### Reading Data

This requires us to clean the data

First we sequence the data, then we cluster and reassemble oi, then we decode the nucleoties back to binary

However, clustering and reassembly are time-consuming

Therefore, we can perform structure preserving encoding

This is where we map DNA read restoration to a data cleaning operation

The data cleaning fixes all of the sequencing errors

We use schema information to restore the data

### Evaluation

It's very expensive, however in initial testing, it stores 36 records across 8 tables, size 12KB with no errors

## Near-Molecule Query Processing

### Selection

To do selection, we need to find an oligo encoding an attribute with a particular value

The key technique is to use Polymerase Chain Reactions (PCR):

- Amplify (i.e. copy) the matching oligo countless times
- We need to know the start and end sequences of the oligo to do this
- This will drown out any background noise of other data

We then sequence the oligo soup to get the attributes

### Join

The goal here is to join records or attributes with equal values

The key technique is the annealing of complementary single stranded oligos, which is when the base pairs match

Matching records/attributes have complementary encodings of the values

This is done by encoding each attribute as before, bu also adding an additional reversed oligo with the value complemented

Then, the annealing bonds together any matching/equal attributes

PCR retrieves only annealed pairs

If two oligos are annealed, they have twice the weight, and so can be easily located

## Trends & Outlooks

Sequencing costs are trending down - each time there is a disruption in the market, it leads to lower cost

Sequencers are now pretty small and affordable

Synthesis is trending down in price also, but is still pretty expensive - it needs a breakthrough to make it feasibly cheap

## Conclusions

It has a huge potential for long-term storage up to 100s of years

It's makes simple in-storage analysis efficiently possible

It's simple storage - it doesn't require copying

However, it's not available yet - it'll be economically viable in 2-10 years
