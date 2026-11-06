---
title: BGP Path Attribute NEXT_HOP
tags:
  - path-attributes
  - bgp
status: draft
version: 0.0.1
---

By default, when sending to an eBGP peer, the NEXT_HOP is changed to an IP address on the advertising router specifically, to the same IP address the router used as the source IP address of the BGP Update message, for each respective neighbor. When sending to an iBGP peer, the default action is to leave the NEXT_HOP PA unchanged. Both of these default behaviors can be changed through the commands listed below

- iBGP: `neighbor... next-hop-self`
- eBGP: `neighbor... next-hop-unchanged`

> *Note that the NEXT_HOP PA cannot be set through a route map*
