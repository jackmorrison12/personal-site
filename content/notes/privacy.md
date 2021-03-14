---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: mli
title: Privacy
slug: privacy
topic: 7.1
hidden: false
tags:
  - Privacy
  - Trustworthy AI/ML
---

## Data Privacy

The <mark>power and effectiveness</mark> of ML is critically <mark>dependent</mark> on the <mark>data</mark> that is used to train the ML models

The <mark>quality of the data</mark> is one of the most important aspects that determines the effectiveness of ML models

Important aspects are:

- <mark>Quality</mark> of the data (curation and representativeness)
- <mark>Quantity</mark> of the data

<mark>More data</mark> for training means you get a <mark>more accurate and robust model</mark>

However, there are hurdles to getting more data:

- Human and societal challenges
  - <mark>Cost and effort</mark> for collecting/annotating data
  - <mark>Incentives</mark> for data sharing (money, fame etc/)
- Technical challenges
  - Data <mark>quality</mark>
  - Data <mark>annotation</mark>
  - Data <mark>exchange formats</mark>
- <mark>Legal challenges</mark>
  - What's allowed?
  - What consent is required?
  - Regulation (such as GDPR)
- <mark>Privacy Challenges</mark>
  - Ethical
  - Trust

Therefore, the optimal privacy preservation requires implementations that are secure by default, so-called privacy by design

This requires

- <mark>Minimal or no data transfer</mark> (Federated learning)
- Provision of theoretical and/or technical <mark>guarantees of privacy</mark> (Differential privacy)

Some other approaches are:

- Homomorphic encryption
- Secure multi-party computing
- Trusted execution environments

### <mark>Federated Learning</mark>

1. The <mark>model is sent to each client</mark> for training on their local data
2. The <mark>local model updates</mark> are <mark>encrypted and sent back</mark> to the server for aggregation
3. The <mark>aggregated model is sent back</mark> to the local client and the model owner (sever)
4. This process is iterated upon

Suppose we have <mark>$N$ training samples</mark>, which are distributed to <mark>$K$ clients</mark>, $P_k$ is the set of indices of samples at client $k$, and $n_k = |P_k|$

$L(\Theta) = \sum\limits_{k=1}^K \frac{n_k}{N} \mathcal{L}_k(\Theta)$

with

$\mathcal{L}_k(\Theta) = \frac{1}{n_k} \sum\limits_{i \in P_k} \mathcal{L}(x_i, y_i, \Theta)$

This uses <mark>gradient descent</mark> in order to do iterative updates, however this can be very slow

Therefore, we can do <mark>stochastic gradient descent</mark>

Suppose a $C$ fraction of clients are selected at each round:

- $C = 1$: full batch (non-stochastic) gradient descent
- $C < 1$: stochastic gradient descent (SGD)

Each client computes $\nabla \mathcal{L}_k(\Theta)$ (<mark>local gradient</mark> in local training set)

The server computes $\nabla \mathcal{L}(\Theta) = \sum\limits_{k=1}^K  \frac{n_k}{N} \nabla \mathcal{L}_k(\Theta)$ (<mark>weighted average of gradients</mark> are summed to calculate the overall gradient of the loss function)

This is known as <mark>federated SGD</mark>

Another method is <mark>federated averaging</mark>, where the <mark>local client updates the local model parameters instead</mark>, and sends these back, and then the server aggregates these instead of the local gradients:

Client: $\Theta_k^{j+1} = \Theta_k^j - \tau \nabla \mathcal{L}_k(\Theta)$

Server: $\Theta^{j+1} = \sum\limits_{k=1}^K \frac{n_k}{N}\Theta_k^{j+1}$

This means each client can do <mark>multiple gradient descent steps</mark>, and it's more efficient as it minimises communication overhead

- First, the model is randomly initialised on the server
- For each round t:
  - A random set of clients are chosen
  - Each client performs local gradient descent steps
  - The server aggregates model parameters submitted by the clients

Some challenges for federated learning are:

- <mark>Non-IID data</mark>
  - Training data for a given client is typically site-specific, hence the site's local dataset will not be representative of the distribution of training samples
  - This means that they may not converge on aggregation
- <mark>Unbalanced data</mark>
  - Sites may have little or lots of training data, leading to varying amounts of local training data across different sites
- <mark>Massively distributed data</mark>
  - There may be extreme scenarios where each site only has very few training samples
- <mark>Communication costs</mark>
  - Communication between clients and servers occurs communication overheads
  - The amount of overhead will depend on the umber of clients and the frequency of updates to\from the server

### [Homomorphic Encryption](/notes/privacy-engineering/fhe)

This is based on the assumption that one can perform <mark>basic arithmetic on encrypted values</mark>

$[x]\bigoplus [y] = [x + y]$ and $[x]\bigotimes [y] = [x * y]$

Where:

- $[xyz]$ is the encryption of some plaintext $xyz$
- $\bigoplus$ is the homomorphic addition in ciphertext space
- $\bigotimes$ is the homomorphic multiplication in ciphertext space

If data was only encrypted in transfer from client to server, and the decrypted on the server, then the <mark>server could see the data in unencrypted form</mark>

Homomorphic encryption prevents this

It allows for:

- Outsourced computation
- Private prediction
- Private training

Advantages:

- Can perform <mark>inference on encrypted data</mark> (model owner never sees client's private data)
- Does not require interaction between data and model owners

Disadvantages:

- <mark>Computationally expensive</mark> as it introduces significant overhead
- Restricted to <mark>certain operations</mark>

### [Secure Multi-Party Computation](/notes/privacy-engineering/mpc)

This is where <mark>computation is split</mark> between <mark>multiple parties</mark>

- <mark>Confidentiality:</mark> nobody with shard of data knows the read value
- <mark>Shared governance:</mark> the value can only be disclosed if everybody agrees

### Trusted Execution Environments

This is where there are a set of <mark>CPU instructions</mark> to create <mark>enclaves in RAM that nobody can access</mark> - except the code from the enclave itself

It ensures <mark>total confidentiality</mark> of data during computation - decryption happens only inside the enclave
