---
title: Multicast L3 Reverse Path Forwarding Check
tags:
  - multicast
  - routing
status: draft
version: 0.0.1
---

Routers cannot simply use logic by which they receive a multicast packet and then forward a copy of it out all other interfaces, without causing multicast packets to loop around the internetwork. To prevent such loops, routers do not forward multicasts out the same interface on which they were received. Multicast routers use a Reverse Path Forwarding (RPF) check to prevent loops. The RPF check adds this additional step to a dense-mode router’s forwarding logic: 
- Look at the source IP address of the multicast packet. If my route that matches the source lists an outgoing interface that is the actual interface on which the packet was received, the packet passes the RPF check. If not, do not replicate and forward the packet.

Different multicast routing protocols determine their RPF interfaces in different ways, as follows:
- Distance Vector Multicast Routing Protocol (DVMRP) maintains a separate multicast routing table and uses it for the RPF check. 
- Protocol Independent Multicast (PIM) and Core-Based Tree (CBT) generally use the unicast routing table for the RPF check
- PIM and CBT can also use the DVMRP route table, the Multiprotocol Border Gateway Protocol (MP-BGP) route table, or statically configured multicast route(s) for the RPF check. 
- Multicast OSPF does not use the RPF check, because it computes both forward and reverse shortest-path source-rooted trees by using the Dijkstra algorithm.
