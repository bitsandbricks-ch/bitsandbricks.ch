---
title: Multicast Internet Group Management Protocol
tags:
  - multicast
  - igmp
status: draft
version: 0.0.1
---

IGMP has evolved from the Host Membership Protocol, described in Dr. Steve Deering’s doctoral thesis, to IGMPv1 (RFC 1112), to IGMPv2 (RFC 2236), to the latest, IGMPv3 (RFC 3376). IGMP messages are sent in IP datagrams with IP protocol number 2, with the IP Time-to-Live (TTL) field set to 1. IGMP packets pass only over a LAN and are not forwarded by routers, because of their TTL field values. 

The two most important goals of IGMP are as follows: 
- To inform a local multicast router that a host wants to receive multicast traffic for a specific group 
- To inform local multicast routers that a host wants to leave a multicast group

Multicast routers use IGMP to maintain information for each router interface about which multicast group traffic they should forward and which hosts want to receive it.
