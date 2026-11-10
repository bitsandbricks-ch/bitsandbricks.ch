---
title: IPv6 - Neighbor Discovery - Messages - Neighbor Solicitation
tags:
  - ipv6
status: draft
version: 0.0.1
---

The neighbor solicitation message is used primarily to find the layer two address of another IPv6 address on the local link. It’s also used for DAD (Duplicated Address Detection). In this packet, the source address will be the source address of the host sending the neighbor solicitation. The destination address will be the solicited-node multicast address of the remote host. This message also includes the layer two address of the host sending it. In the ICMP header of this packet, you will find a type value of 135.

Using solicited-node multicast addresses as the destination is far more efficient than IPv4’s ARP requests broadcast to all hosts.
