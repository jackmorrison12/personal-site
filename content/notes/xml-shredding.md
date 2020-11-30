---
type: note
baseurl: /notes/
fullurl: " "
logo: " "
hero: " "
course: scalable-systems
title: XML Shredding
slug: xml-shredding
topic: 4.1
hidden: false
tags:
  - XML
  - XRel
  - XParent
---

# What is XML?

<div class="def">
  <span class="is-primary bold">XML: </span> Extensible Markup Language
</div>

XML is a language used to <mark>structure, store and send data</mark> between systems

It's designed to <mark>describe data and focus on what data is</mark>, and to be easy to understand

## XML Rules

The <mark>first tag is the root</mark> of the tree - a tree only had one root

Every other <mark>matching pair of tags becomes a node</mark>. If a pair of tags is contained inside another pair of tags, then they are a <mark>child of the containing pair</mark>. Children are ordered

Text inside tags becomes a child of the node corresponding to the enclosing tags - these are always leaf nodes

XML allows <mark>single tags</mark>, which are leaves wih a box

<mark>Tags are case sensitive</mark>, and have to be well formed (properly nested)

An example of some XML:

```
<States>
  <State>
    <Name>NewJersey</Name>
    <Number>1</Number>
  </State>
  <State>
    <Name>NewYork</Name>
    <Number>2</Number>
  </State>
  <Gov>
    <Location>Washington</Location>
  </Gov>
</States>
```

This gives a tree-like structure of data

## DTD

A valid <mark>XML document is well formed</mark> - meaning it also conforms to the rules of a Document Type Definition (DTD)

A DTD is like a <mark>database schema for XML files</mark> - it's usually referenced in the header of the XML file

An example for a DTD is:

```
<?XML cersion = "1.0"?>
<!DOCTYPE note [
  <!Element note(to,from,heading,notebody)>
  <!Element to(#PCDATA)>
  <!Element from(#PCDATA)>
  <!Element heading(#PCDATA)>
  <!Element notebody(#PCDATA)>
]>
```

Some XML which follows this schema is:

```
<note>
  <to>CS 731</to>
  <from>21456687</from>
  <heading>presentation</heading?
  <notebody>XML Introduction</notebody>
</note>
```

The `<!Element note(to,from,heading,notebody)>` tag defined the note element as having four elements, `to,from,heading,notebody`, in that specific order

`<!Element to(#PCDATA)>` defines the `to` element of type `#PCDATA`, which is Parsed Character Data (a character string)

There are some more symbols you can add, for example:

- `<!ELEMENT note (message +)>` - Declaring a <mark>minimum of one</mark> occurrence of the `message` element
- `<!ELEMENT note (message *)>` - Declaring <mark>zero or more occurrences</mark> of the `message` element
- `<!ELEMENT note (message ?)>` - Declaring <mark>zero or one occurrence</mark> of the `message` element

## Advantages of XML

XML is an <mark>open standard</mark>, so can be used by anyone

It's <mark>human readable</mark>

It's <mark>easy to process</mark>

It can be used to integrate complex web based systems, as it's useful in communications

However, one downside is that it <mark>inflates the size of the data</mark> - it adds info which could be compressed away

## Importance of XML

It's fast emerging as the <mark>dominant standard for representing data</mark> on the internet (along with JSON)

Most organisations use XML as a <mark>data communications standard</mark>

Commercial development frameworks are XML oriented (e.g. .NET and Java)

All <mark>modern web systems architecture</mark> is designed based on XML (e.g. HTML)

# XML in Databases

XML can be stored in:

- <mark>Relational databases</mark>
- File systems
- Object-oriented databases
- Special purpose systems

## Storing XML in Databases

There are two main ways to store XML data in databases:

<mark>Structure-Mapping Approach</mark>: The design of the database schema is <mark>based on the understanding of the DTD</mark>

<mark>Model-Mapping Approach</mark>: No DTD information is required for data storage - a <mark>fixed database schema</mark> is used to store XML documents

Model-mapping approaches are more useful, since:

1. They're capable of supporting <mark>any sophisticated XML applications</mark> that are considered as static or dynamic
2. They're capable of supporting <mark>well-formed but non-DTD</mark> XML applications
3. They <mark>don't require extending the expressive power of database models</mark> in order to support XML documents. It's possible to store them in off-the-shelf DBMSs

Some examples of model-mapping approaches are:

<mark>Edge Oriented Approaches</mark>:

- Edge (All the edges of XML document are stored in a single table)
- Monet (It partitions the edge table according to all possible label paths)
- XParent (Based on LabelPath, DataPath, Element and Data)

<mark>Node Oriented Approach</mark>:

- XRel (XML data stored based on Path, Element, Text and Attribute)

### Key Terms

<div class="def margin-5-b">
  <span class="is-primary bold">Ordinal: </span>The ordinal of an element is the order of this element among all siblings of the same type which share the same parent
</div>

<div class="def margin-5-b">
  <span class="is-primary bold">Label-Path: </span>A label-path in an XML data graph is a dot separated sequence of edge labels, e.g. DBGroup.Member.Name
</div>

<div class="def">
  <span class="is-primary bold">Data-Path: </span>A data-path is a dot separated alternating sequence of element nodes, e.g. &1.&2.&7
</div>

### Edge Approach

This has just one table - the <mark>edge table</mark>, which can be represented as:

`Edge(Source, Ordinal, Target, Label, Flag, Value)`

Where:

- `Source` represents the source node in the data graph
- `Ordinal` is the order of elements among the siblings
- `Target` is the target node which the current node is pointing to
- `Label` is the name in the XML document
- `Flag` is the type of the data being represented
- `Value` is the data in the document

Some <mark>values can be empty</mark>, for example if they have no data in them

### Monet Approach

This approach stores <mark>XML in multiple tables</mark>

It <mark>partitions the edge table on all possible label paths</mark>, where the number of tables = the number of distinct label paths

Tables are classified as:

- `Element Node (Source, Target, Ordinal)` - this combination represents a <mark>unique edge in an XML data graph</mark>
- `Text Node (ID, Value)` - the <mark>type of the value is explicit in the table name</mark>. This is a leaf node

### XRel Approach

This is a <mark>node-oriented approach</mark> - it maintains nodes individually

It stores XML in four tables:

- `Path (PathID, Pathexp)` - this table maintains the simple path expression identifier `PathID` and path expression `Pathexp`
- `Element (PathId, Start, End, Ordinal)` - this table contains the start and end positions of a region for a given `PathID`, where the region of a node is the start and end positions of this node in the XML document
- `Text (PathID, Start, End, Value)` - this table contains the start and end positions and the value of the element for a given `PathID`
- `Attribute (PathId, Start, End, Value)` - this table contains the start and end positions and the value of the attribute for a given `PathID`

### XParent Approach

This is another <mark>edge-oriented approach</mark>

It has four tables:

- `LabelPath (ID, Lan, Path)`
- `DataPath(Pid, Cid)`
- `Element(PathID, Ordinal, Did)`
- `Data (PathID, Did, Ordinal, Value)`

## Querying XML in Databases

The approaches above all <mark>depend on the types of query you want to execute</mark> to decide which one performs best, however typically:

- <mark>XRel and XParent</mark> outperform Edge in <mark>complex queries</mark>
- <mark>Edge</mark> performs better when using <mark>simple queries</mark>
- <mark>Label-paths</mark> help in <mark>reducing the querying time</mark>
