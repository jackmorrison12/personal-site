---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Data Centres
slug: data-centres
topic: 7.3
hidden: false
tags:
  - Data Centres
---

## What is a Data Centre?

It's a physical facility that enterprises use to house computing ans storage infrastructure in a variety of networked formats

The main function is to deliver utilities needed by the equipment and personnel, such as power, cooling, shelter and security

They're usually around 500-5000 sqm buildings, consuming from 1 to 20 MW of power

## What should they be optimised for?

Some questions you may ask in order to optimise a data centre are:

- Does the business require mirrored data centres?
- How much geographic diversity is requires?
- What is the necessary time to recover in the case of an outage?
- How much room is required for expansion?
- Should you lease a private data centre or a public service?
- What are the bandwidth and power requirements?
- Is there a preferred carrier?
- What kind of physical security is needed?

## Data Centre Standards and Classification (ANSI-TIA-942)

| Tier | Generators | UPSs | Power Feeds        | HVAC | Availability |
| ---- | ---------- | ---- | ------------------ | ---- | ------------ |
| 1    | None       | N    | Single             | N    | 99.671%      |
| 2    | N          | N+1  | Single             | N+1  | 99.741%      |
| 3    | N+1        | N+1  | Dual, switchable   | N+1  | 99.982%      |
| 4    | 2N         | 2N   | Dual, simultaneous | 2N   | 99.995%      |

As you increase the tier, you should increase the reduncancy

We have:

- Generators: This is the backup power, where N is the default capacity to support
- UPSs: Uninterruptible Power Supply, which will supply power for a short amount of time
- Power Feeds: These are how electricity is fed into the data centre
- HVAC - This is cooling
- Availability - This is the % of time the data centre is working as expected

They tiers are named:

- Rate-1: Basic Site Infrastructure
- Rate-2: Redundant Capacity Component Site Infrastructure
- Rate-3: Concurrently Maintainable Site Infrastructure
- Rate-4: Fault-Tolerant Site Infrastructure

## What are the Main Components of a Data Centre?

The main components are:

- Power Distribution Unit
- Computer Air Handling Unit
- Individual Colocation Computer Cabinets
- Emergency Diesel GEnerators
- Fuel Oil Storage Tanks
- UPS System
- Electrical Primary Switchgear
- Pump Room
- Heat Rejection Devices
- Colocation Suites

We also have servers mounted on 19" rack cabinets - these servers consist of CPUs, DRAM and Disks

Each rack as 40-80 servers and an ethernet switch

Racks are places in single rows forming corridors between them used for cooling

Today's DCs can use shipping containers packed with 1000s of servers each

For repairs the whole container is replaces, so you let servers fail, and when a threshold is reaches, you send that container back and replace them

These containers can be packed densely with racks, include power distribution and cooling, and are easy to move

## Data Centre Costs

The total cost of ownership (TCO) is a combination of the capital expenses and the operational expenses, so:

$TCO = CapEx + OpEx$

Where:

- $CapEx$ (Capital Expenses) are investments which must be made upfront, such as buying the server hardware - paid for by cloud provider
- $OpEx$ (Operational Expenses) are the monthly costs of running the equipment, such as electricity and maintenance - paid for by tenant

Data Centres consume 3% of the global electricity supply (around 416.2 TWh), and produce around 2% of greenhouse gas emmisions

The cost is split as follos:

- 57% - Servers (upfront)
- 18% - Power Distribution & Cooling
- 13% - Power
- 8% - Networking Equipment
- 4% - Other Infrastructure

So 31% of this os power, which is an operational expense

The Power Usage Effectiveness (PUE) is the ratio of

- The total amount of energy used by a DC facility (electricity given)
- To the energy delivered to the computing equipment (electricity used)

It's the inverse of data centre infrastructure efficiency

The total facility power covers IT systems such as servers, network ans storage, as well as other equipment such as cooling, generators and lights

Data Centre operators can reduce costs by:

- Moving the location depending on cooling and power cost
- Raising the temperature of the aisles (it mat increase failure rate, but it reduces cooling costs - it's about balance)
- Reduce conversion of energy
- Go to extreme environments, such as the Arctic circle or underwater
- Reuse dissipated heat

## Data Centre Challenges

### Cooling Data Centres

There are four main methods:

1. Conventional cooling - blow in cold air one side, and hot air out the other
2. Cold Aisle Containment (CAC) - between racks, have a cold aisle, which is contained, and hot air blows out the other aisles
3. Hot Aisle Containment (HAC) - between racks, have a hot aisle, which is container, and cold air blows in from the other aisles
4. Thermal modelling - This is where programs are used to model the cooling scenarios to find the best option

### Energy Proportional Computing

The aim is to get power consumption to grow linearly with the utilisation of the equipment

Average real-world data centres are too inefficient, as they waste 2/3 of their energy

Energy consumption is not proportional to load - CPUs aren't so bad, but other components are

We therefore try to optimise workloads

Ideally, an idle server should consume no power, as it is doing no useful work

### Managing a Data Centre and its Resources

Servers are idle most of the time - for non-virtualised servers, they have 6-15% utilisation

Virtualisation can increase this to ~30% on average

Resource virtualisation can be done using:

- Hyperscale system management software
  - Cloud companies treat the data centre as a warehouse-scale computer
  - Software-defined data centres
  - System management software that allows DC operators to manage the entire DC infrastructure
  - Enables the ability to compose a system using pooled resources that include compute, network and storage based on workload requirements
- Dynamic resource allocation
  - In a traditional DC, resources are static, with dedicated CPU resources determined per workload
  - No aligned for workloads whose requirements change over time
  - Virtualisation is not enough to improve efficiency
  - Need the ability to dynamically allocate CPU resources across servers and racks, allowing admins to quickly migrate resources to address the shifting demand
  - Drive 100-300% better utilisation for virtualised workloads, and 200-600% for bare-metal workloads

Even with virtualisation, and software-defined DC, resource utilisation can be poor

We have the need for efficient monitoring and cluster management - we need to predict the usage of resources effectively!

### Managing Scale and Growth

Over time, the number of servers will grow

The scale and complexity of DC operations grows constantly - currently there is over 600 million GB of new data saved each dat

We need tp build the right abstractions to work for a range of workloads at hyperscale

This requires Software Defined Networking (SDN) - this is where the properties of the network infrastructure are implemented in software, so we have more flexibility on how to manage software and change the networking
