---
title: IPv6 - IPv6 Address Glean
tags:
  - ipv6
status: draft
version: 0.0.1
---

IPv6 address glean is the foundation for many other IPv6 features that depend on an accurate binding table. It inspects ND and DHCP messages on a link to glean addresses, and then populates the binding table with these addresses. This feature also enforces address ownership and limits the number of addresses any given node is allowed to claim.
