---
title: BGP Advertising Routes to Neighbors
tags:
  - bgp
status: draft
version: 0.0.1
---

BGP routers take routes from the local BGP table and advertise a subset of those routes to their BGP neighbors. This section continues to focus on the BGP table because the BGP route advertisement process takes routes from the BGP table and sends them to neighboring routers, where the routes are added to the neighbors’ BGP tables. 

A router builds the contents of its Update messages based on the contents of its BGP table. The router must choose which subset of its BGP table entries to advertise to each neighbor
The rules about which routes BGP does not include in routing updates to each neighbor; each rule is described more fully following the table.

| iBGP and/or eBGP | Routes Not Taken from the BGP Table                       |
| ---- | --- |
| Both             | Routes that are not considered “best”                     |
| Both             | Routes matched by a deny clause in an outbound BGP filter |
| iBGP             | iBGP-learned routes[^1]                                   |
Additionally, BGP rules out some routes from being considered best based on the value of the NEXT_HOP PA. For a route to be a candidate to be considered best, the NEXT_ HOP must be either
- 0.0.0.0, as the result of the route being injected on the local router. 
- Reachable according to that router’s current IP routing table. In other words, the NEXT_HOP IP address must match a route in the routing table.

### Summary of Rules for Routes Advertised in BGP Updates
The following list summarizes the rules dictating which routes a BGP router sends in its Update messages: 
- Send only the best route listed in the BGP table. 
- To iBGP neighbors, do not advertise paths learned from other iBGP neighbors. 
- Do not advertise suppressed or dampened routes. 
- Do not advertise routes filtered through configuration.

[^1]: This rule is relaxed or changed as a result of using route reflectors or confederations.
