---
title: BGP Synchronization
tags:
  - bgp
status: draft
version: 0.0.1
---

BGP synchronization is best understood when considered in the context in which it was intended to be used namely, with the redistribution of BGP routes into the IGP. This method is seldom used by ISPs today, mainly because of the large number of routes that would be injected into the IGP. However, using BGP sync with redistribution solves both problems related to the routing black hole.

Sync works by controlling whether a BGP table entry can be considered “best”; keep in mind that a route in the BGP table must be considered to be “best” before it can be advertised to another BGP peer. The BGP sync logic controls that decision as follows: Do not consider an iBGP route in the BGP table as “best” unless the exact prefix was learned through an IGP and is currently in the routing table. Sync logic essentially gives a router a method to know whether the non-BGP routers inside the AS should have the ability to route packets to the prefix.
