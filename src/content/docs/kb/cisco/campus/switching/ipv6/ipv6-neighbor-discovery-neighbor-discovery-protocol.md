---
title: IPv6 - Neighbor Discovery - Neighbor Discovery Protocol
tags:
  - ipv6
status: draft
version: 0.0.1
---

One of the differences between IPv4 and IPv6 is that we no longer use ARP (Address Resolution Protocol). ND (Neighbor Discovery Protocol) replaces the functionality of ARP. In this lesson, we’ll take a look at how ND works.

ND uses ICMP and solicited-node multicast addresses to discover the layer two address of other IPv6 hosts on the same network (local link). It uses two messages to accomplish this:
