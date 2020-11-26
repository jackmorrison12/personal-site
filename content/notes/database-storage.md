---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: Database Storage
slug: database-storage
topic: 1
hidden: false
tags:
  - Databases
  - Disks
---

# DBMS Layers

When queries enter the system, they go down through these layers:

- Query optimisation and Execution
- Relational Operators
- Files and Access Methods
- Buffer Management
- <mark>Disk Space Management</mark>
- <mark>Storage</mark>

The <mark>OS</mark> can handle <mark>Buffer and Disk Space Management</mark>. However, <mark>DBMSs implement this themselves</mark>. This is because the OS gets in the way of the DBMS - the DBMS knows more about the query, and needs to do things in its own way

Some examples of this are:

- Specialised <mark>prefetching</mark>
- Control over <mark>buffer replacement policy</mark> (LRU is not always best!)
- Control over <mark>thread/process scheduling</mark> (To avoid the convoy problem, when the OS scheduling conflicts with DBMS locking)
- Control over <mark>flushing data to disk</mark> (Can be important for recovery, for example by writing a log file)

# Why Disks?

DBMSs store information on disks. They're pretty <mark>old, cheap, mechanical machines for storage</mark>

They're much <mark>cheaper than SSD/RAM</mark>, but they have <mark>mechanical parts</mark>, and so are more prone to failure

The time to access a piece of data really depends on where it is stored on disk

Transferring to or from disk are high-cost operations, and so must be planned carefully

## Why not store all data in <mark>main memory</mark>?

### 1: The <mark>cost</mark> is too high

- High end databases are sometimes in the petabyte range
- Around 60% of the cost of a production system is on disks

### 2: Main memory is <mark>volatile</mark>

- If the power goes out, you want your data to persist!

### However, main memory databases do exist...

- They're usually of a smaller size, and are optimised for performance
- Volatility is ok for some applications, so you can reduce the chances by mirroring on multiple machines

## What about <mark>flash</mark>?

Flash has been used for years, and is used in personal computers

However, it is still <mark>too expensive</mark> to use for a massive database system

It can be used in some systems if they have a small size, and so can limit the cost, however it is most usually used as some kind of specialised cache or logging device

# The Storage Heirarchy

The hierarchy of storage is as follows:

1. CPU
2. L1 Cache
3. L2 Cache
4. L3 Cache
5. Main Memory
6. Flash Storage
7. Magnetic Disk
8. Magnetic Tape

The <mark>higher up</mark> the hierarchy you go, the <mark>smaller and faster</mark> the storage medium gets, however it also gets <mark>more expensive</mark>

Flash storage can also be used alongside main memory or magnetic disk, e.g. to cache frequently used data on disk

# How Disks Work

They are the secondary storage device of choice

The main advantage over tapes is that you can have <mark>random access</mark> (over sequential access)

Data is stored and retrieved in units called <mark>disk blocks</mark> or pages, which are usually in the order of KB

Unlike RAM, the <mark>time to retrieve a disk page varies depending on the location on the disk</mark>, so relative placement of pages has a major impact on DBMS performance!

## Disk Anatomy

A disk has <mark>multiple platters</mark>, which spin at 5k-15k RPM

The arm assembly is moved in or out to position a head under a desired track. All of the <mark>tracks under a head</mark> make up an imaginary <mark>cylinder</mark>

Only one head can read or write at once

<mark>Block size</mark> is a <mark>multiple</mark> of <mark>sector size</mark>

Newer disks also have <mark>zones</mark>, where more data is located on <mark>outer tracks</mark>, as they're larger

The <mark>speed on the outer tracks is faster</mark>, meaning it is faster to access data there

## Accessing a disk page

The time to access a disk block consists of:

- <mark>Seek Time</mark> (The time moving an arm in or out to the correct track)
- <mark>Rotational Delay</mark> (The time waiting for a block to rotate under the head)
- <mark>Transfer Time</mark> (The time to actually read the data into main memory)

### Seek Time

For a <mark>small change</mark>, we don't need to really move the arm, just <mark>reposition the head</mark>, which takes a constant amount of time

Short seeks are dominated by <mark>settle time</mark>

- The head can move to one of many nearby tracks within the settle time
- It's in the order of tens to hundreds of milliseconds
- It increases with disk track density

### Rotational Delay

We need to wait for the disk to turn until the block we want is below the head

### Seek Time and Rotational Delay Dominate

<mark>Seek time</mark> can vary from <mark>1-20ms</mark>
<mark>Rotational delay</mark> can vary from <mark>0-10ms</mark>
<mark>Transfer time</mark> is usually <mark><1ms per 4KB page</mark>

Therefore, the key to decreasing lower IO cost is... to <mark>reduce seek & rotational delays</mark> (random access)

## Arranging Pages On Disk

What's the concept of the "next" block?

This is usually

- blocks on the <mark>same track</mark>, followed by
- blocks on the <mark>same cylinder</mark>, followed by
- blocks on the <mark>adjacent cylinder</mark>

To minimise seek and rotational delay, blocks should be arranged <mark>sequentially on disk</mark> (so following the next pattern above)

If blocks are <mark>written together</mark>, they're likely to be <mark>read together</mark> (so written in one go)

Also by storing related information together, we enable <mark>pre-fetching</mark>

## Defragmentation

For disks, over time, <mark>files are spread out across the disk</mark>, which takes a long time to read as there are a lot of random reads

Defragmentation takes the file and <mark>puts all of the pages as close together as possible</mark>

This is not needed for SSDs, since we don't have much difference between random and sequential access, and SSDs have a limited number of times you can read from and write to a certain block, and so defragmenting the disk would be wasting these by doing it unnecessarily

It's not really used any more - it may be done automatically, e.g. in MacOS

## Adjacent Blocks

These are blocks where <mark>access occurs in settle time only</mark>

It <mark>doesn't</mark> have to be the <mark>next block</mark>; since the disk travels a few tracks during settle time, it may go a few tracks over, and so that may be the actual 'adjacent' block

A page can have <mark>more than one neighbour</mark>

Therfore, you should spread data in a pattern so that it is (almost) a sequential read - which does not have to strictly be next to each other

## Disk Summary

As a rule of thumb...

- <mark>Memory access is much faster than disk I/O</mark>, in the order of ~1000x
- <mark>Sequential IO is faster than random I/O</mark>, in the order of ~10x

So the lowest layer of the DBMS software manages space on the disk

Higher levels will call upon this later to:

- allocate/de-allocate a page
- read/write a page

As we saw, it's best if a request for a sequence of pages is satisfied by pages stored sequentially on disk, however this is all sorted out by the data layer, and so is abstracted away for the higher levels, which don't need to know how this is done and how free space is managed.

# Summary

- Disk will still be around for the next few decades
- They have a <mark>good performance-cost trade off</mark>
- Data which is <mark>retrieved together should be stored together</mark>
- <mark>Random access should be avoided</mark>, and use sequential access wherever possible!
- <mark>Data structures</mark> designed for disk should <mark>logically align with the size of a disk page</mark> (if we have a structure which slightly eats into the next page, we have to retrieve 2 pages each time)
