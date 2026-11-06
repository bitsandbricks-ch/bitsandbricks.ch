---
title: Layer 3 Access (Routed Access)
tags:
  - principals
status: draft
version: 0.0.1
---

Routed access is an alternative configuration in which Layer 3 is extended all the way to the access layer switches. In this design, access layer switches act as full Layer 3 routed nodes (providing both Layer 2 and Layer 3 switching), and the access-to-distribution Layer 2 uplink trunks are replaced with Layer 3 point-to-point routed links. Consequently, the Layer 2/ Layer 3 demarcation point is moved from the distribution switch to the access switch

The routed access-to-distribution block design has a number of advantages over the Layer 2 access layer design:
- No first-hop redundancy protocol required: It eliminates the need for first-hop redundancy protocols such as HSRP and VRRP.
- No STP required: Because there are no Layer 2 links to block, this design eliminates the need for STP.
- Increased uplink utilisation: Both uplinks from access to distribution can be used, increasing the effective bandwidth available to the end users and endpoints connected to the access layer switches.
- Easier troubleshooting: It offers common end-to-end troubleshooting tools (such as ping and traceroute).
- Faster convergence: It uses fast-converging routing protocols such as Enhanced Interior Gateway Routing Protocol and Open Shortest Path First (OSPF).

While this is an excellent design for many environments, it has the same limitation as the Layer 2 access loop-free design: It does not support spanning VLANs across multiple access switches. In addition, it might not be the most cost-effective solution because access layer switches with Layer 3 routing capability might cost more than Layer 2 switches.
