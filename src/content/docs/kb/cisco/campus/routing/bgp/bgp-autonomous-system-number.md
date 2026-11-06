---
title: BGP Autonomous System Number
tags:
  - bgp
status: draft
version: 0.0.1
---

An Autonomous System (AS) is defined as a collection of IP routing prefixes that are under the control and authority of a single administrative entity or domain. Each AS presents a clearly defined routing policy to the rest of the Internet.

The BGP routing protocol uses these ASes to define its routing policies and mechanisms. Each AS is assigned an autonomous system number (ASN), for use with BGP routing. ASNs on the Internet must be unique and are assigned by local internet registries, which in turn receive blocks of ASNs for assignment from the Internet Assigned Numbers Authority (IANA).

Until 2007, AS numbers were defined as 16-bit integers, which allowed for a maximum of 65,536 assignments. As the ASN space was becoming exhausted, a new 32-bit format was introduced delivering up to 4.2 billion ASNs.

In the 16-bit notation, the ASN range of 64512 - 65534 is reserved for private use within enterprise networks. Similarly, in the 32-bit notation, the 4200000000 - 4294967294 range is reserved for private use as well. These ASNs are not definable on the public Internet.
