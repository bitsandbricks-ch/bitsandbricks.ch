---
title: IPv6 - Neighbor Discovery - Messages - Neighbor Advertisement
tags:
  - ipv6
status: draft
version: 0.0.1
---

Once the remote host receives the neighbor solicitation, it will reply with the neighbor advertisement message. The source address is the IPv6 address of the host, and the destination address is the IPv6 address of the remote host that sent the neighbor solicitation. The most important part is that this message includes the layer two address of the host. The neighbor advertisement message uses type 136 in the ICMPv6 packet header.
