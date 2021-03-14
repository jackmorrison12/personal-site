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

The power and effectiveness of ML is critically dependent on the data that is used to train the ML models

The quality of the data is one of the most important aspects that determines the effectiveness of ML models

Important aspects are:

- Quality of the data (curation and representativeness)
- Quantity of the data

More data for training means you get a more accurate and robust model

However, there are hurdles to getting more data:

- Human and societal challenges
  - Cost and effort for collecting/annotating data
  - Incentives for data sharing (money, fame etc/)
- Technical challenges
  - Data quality
  - Data annotation
  - Data exchange formats
- Legal challenges
  - What's allowed?
  - What consent is required?
  - Regulation (such as GDPR)
- Privacy Challenges
  - Ethical
  - Trust

Therefore, the optimal privacy preservation requires implementations that are secure by default, so-called privacy by design

This requires

- Minimal or no data transfer (Federated learning)
- Provision of theoretical and/or technical guarantees of privacy (Differential privacy)

Some other approaches are:

- Homomorphic encryption
- Secure multi-party computing
- Trusted execution environments

### Federated Learning

1. The model is sent to each client for training on their local data
2. The local model updates are encrypted and sent back to the server for aggregation
3. the aggregated model is sent back to the local client and the model owner (sever)
4. This process is iterated upon

Suppose we have $N$ training samples, which are distributed to $K$ clients, $P_k$ is the set of indices of samples at client $k$, and $n_k = |P_k|$

$L(\Theta) = \sum\limits_{k=1}^K \frac{n_k}{N} \mathcal{L}_k(\Theta)$

with

$\mathcal{L}_k(\Theta) = \frac{1}{n_k} \sum\limits_{i \in P_k} \mathcal{L}(x_i, y_i, \Theta)$

This uses gradient descent in order to do iterative updates, however this can be very slow

Therefore, we can do stochastic gradient descent

Suppose a $C$ fraction of clients are selected at each round:

- $C = 1$: full batch (non-stochastic) gradient descent
- $C < 1$: stochastic gradient descent (SGD)

Each client computes $\nabla \mathcal{L}_k(\Theta)$ (local gradient in local training set)

The server computes $\nabla \mathcal{L}(\Theta) = \sum\limits_{k=1}^K  \frac{n_k}{N} \nabla \mathcal{L}_k(\Theta)$ (weighted average of gradients are summed to calculate the overall gradient of the loss function)

This is known as federated SGD

Another method is federated averaging, where the local client updates the local model parameters instead, and sends these back, and then the server aggregates these instead of the local gradients:

Client: $\Theta_k^{j+1} = \Theta_k^j - \tau \nabla \mathcal{L}_k(\Theta)$

Server: $\Theta^{j+1} = \sum\limits_{k=1}^K \frac{n_k}{N}\Theta_k^{j+1}$

This means each client can do multiple gradient descent steps, and it's more efficient as it minimises communication overhead

- First, the model is randomly initialised on the server
- For each round t:
  - A random set of clients are chosen
  - Each client performs local gradient descent steps
  - The server aggregates model parameters submitted by the clients

Some challenges for federated learning are:

- Non-IID data
  - Training data for a given client is typically site-specific, hence the site's local dataset will not be representative of the distribution of training samples
  - This means that they may not converge on aggregation
- Unbalanced data
  - Sites may have little or lots of training data, leading to varying amounts of local training data across different sites
- Massively distributed data
  - There may be extreme scenarios where each site only has very few training samples
- Communication costs
  - Communication between clients and servers occurs communication overheads
  - The amount of overhead will depend on the umber of clients and the frequency of updates to\from the server

### [Homomorphic Encryption](/notes/privacy-engineering/fhe)

This is based on teh assumption that one can perform basic arithmetic on encrypted values

$[x]\bigoplus [y] = [x + y]$ and $[x]\bigotimes [y] = [x * y]$

Where:

- $[xyz]$ is the encryption of some plaintext $xyz$
- $\bigoplus$ is the homomorphic addition in ciphertext space
- $\bigotimes$ is the homomorphic multiplication in ciphertext space

If dta was only encrypted in transfer from client to server, and the decrypted on the server, then the server could see the data in unencrypted form

Homomorphic encryption prevents this

It allows for:

- Outsourced computation
- Private prediction
- Private training

Advantages:

- Can perform inference on encrypted data (model owner never sees client's private data)
- Does not require interaction between data and model owners

Disadvantages:

- Computationally expensive as it introduces significant overhead
- Restricted to certain operations

### [Secure Multi-Party Computation](/notes/privacy-engineering/mpc)

This is where coomputation is split between multiple parties

- Confidentiality: nobody with shard of data knows the read value
- Shared governance: the value can only be disclosed if everybody agrees

### Trusted Execution Environments

This is where there are a set of CPU instructions to create enclaves in RAM that nobody can access - except the code from the enclave itself

It ensures total confidentiality of data during computation - decryption happens only inside the enclave
