---
title: Simplified Campus
tags:
  - principals
status: draft
version: 0.0.1
---

The simplified campus design relies on switch clustering such as a virtual switching system (VSS) and stacking technologies such as StackWise, in which multiple physical switches act as a single logical switch. Clustering and stacking technologies can be applied to any of the campus building blocks to simplify them even further. Using this design offers the following advantages:

- Simplified design: By using the single logical distribution layer design, there are fewer boxes to manage, which reduces the amount of time spent on ongoing provisioning and maintenance.
- No first-hop redundancy protocol required: It eliminates the need for first-hop redundancy protocols such as HSRP and VRRP because the default IP gateway is on a single logical interface.
- Reduced STP dependence: Because EtherChannel is used, it eliminates the need for STP for a Layer 2 access design; however, STP is still required as a failsafe in case multiple access switches are interconnected.
- Increased uplink utilisation: With EtherChannel, all uplinks from access to distribution can be used, increasing the effective bandwidth available to the end users and endpoints connected to the access layer switches.
- Easier troubleshooting: The topology of the network from the distribution layer to the access layer is logically a hub-and-spoke topology, which reduces the complexity of the design and troubleshooting.
- Faster convergence: With EtherChannel, all links are in forwarding state, and this significantly optimises the convergence time following a node or link failure event because EtherChannel provides fast sub-second failover between links in an uplink bundle.
- Distributed VLANs: With this design, VLANs can span multiple access switches without the need to block any links.
