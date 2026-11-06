---
title: BGP Atomic Aggregate
tags:
  - bgp
status: draft
version: 0.0.1
---

The atomic aggregate attribute is a well-known discretionary BGP attribute. This means that it must be recognized by all BGP speakers, but it does not have to be included in all BGP updates. The atomic aggregate attribute informs BGP peers that the router is using a less specific "aggregate" route to a destination.

If a BGP speaker selects an aggregate route, when a more specific route is available, it must attach the Atomic Aggregate attribute when propagating the route. The purpose of the attribute is to alert BGP speakers along the path that some information may have been lost due to the route aggregation process and that the aggregate path might not be the best path to the destination.

When you use the Atomic Aggregate attribute, the BGP speaker has the option to send the Aggregator attribute. The Aggregator attribute includes the AS number and the IP address of the router that originated the aggregated route. In Cisco routers, the IP address is the router ID of the router that performs the route aggregation.
