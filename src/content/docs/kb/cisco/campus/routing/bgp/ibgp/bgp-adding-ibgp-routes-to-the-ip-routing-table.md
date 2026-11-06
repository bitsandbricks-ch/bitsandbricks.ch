---
title: BGP Adding iBGP Routes to the IP Routing Table
tags:
  - ibgp
  - bgp
status: draft
version: 0.0.1
---

Cisco IOS has the same two requirements for adding iBGP routes to the IP routing table as it does for eBGP routes: 
- The route must be the best BGP route. 
- The route must be the best route (according to the AD) in comparison with other routing sources.

Additionally, for iBGP-learned routes, IOS considers the concept of BGP synchronization. With BGP synchronization (often called sync) disabled using the no synchronization command, BGP uses the same logic for iBGP routes as it does for eBGP routes regard- ing which routes to add to the IP routing table. However, enabling BGP sync (with the synchronization BGP subcommand) prevents a couple of problems related to IP routing.
