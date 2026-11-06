---
title: BGP
tags:
  - bgp
status: draft
version: 0.0.1
---

Border Gateway Protocol (BGP) is an exterior gateway protocol designed to exchange routing information between autonomous systems on the Internet. Unlike OSPF and EIGRP, which are a link state, and distance vector routing protocols respectively, BGP is known as a path-vector routing protocol. It makes decisions based on paths, network policies and sets of rules configured by a network administrator.

BGP comes in two "flavors"
- external BGP (eBGP)) - used to exchange routes between ASes
- internal BGP (iBGP) - used to exchange routes between BGP routers within ASes
