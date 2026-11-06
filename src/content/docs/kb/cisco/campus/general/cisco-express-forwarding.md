---
title: Cisco Express Forwarding
tags:
  - general
status: draft
version: 0.0.1
---

# Hardware CEF

The main advantage of the distributed forwarding is that the packet performance is greatly improved by offloading the packet switching to the line cards. Special ASIC Chips are used for those operations

# Software CEF

Software Based Routers, the CPU is in charge of all operations

Software CEF also known as the software forwarding information base consists of the following components:
- Forwarding Information Base (FIB)
- Built form the routing table
- CEF uses the FIB to make IP destination prefix-based switching decisions
- Adjacency Table (Adjacency Information base)
- This table constinst of data form the ARP table or other l2 protocol tables
