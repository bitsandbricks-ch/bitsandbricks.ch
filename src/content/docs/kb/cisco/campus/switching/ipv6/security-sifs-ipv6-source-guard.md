---
title: Security - SIFS - IPv6 - Source Guard
tags:
  - ipv6
status: draft
version: 0.0.1
---

The switch filters all packets where the source address is not found in the IPv6 binding table. This helps against spoofing attacks where the source address is not found in the IPv6 binding table.

IPv6 Source Guard is one of the IPv6 FHS (First Hop Security) features. It filters inbound traffic on L2 switch ports that are not in the IPv6 binding table. The binding table stores the following information:

- IPv6 address
- MAC address
- VLAN
- Interface ID

Source Guard only looks at information found in the binding table, and it doesn’t fill the binding table. You need another feature like ND inspection or IPv6 snooping to do this.

When source guard denies traffic because it is not found in the binding table, it notifies the IPv6 address glean feature. This feature can query a DHCP server or uses IPv6 ND (Neighbor Discovery) to find the missing information, if possible.
