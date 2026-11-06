---
title: BGP Route Reflectors
tags:
  - bgp
status: draft
version: 0.0.1
---

Route reflectors (RR) achieve the same result as confederations: They remove the need for a full mesh of iBGP peers, allow all iBGP routes to be learned by all iBGP routers in the AS, and prevent loops. In an iBGP design using RRs, a partial mesh of iBGP peers is defined. Some routers are configured as RR servers; these servers are allowed to learn iBGP routes from their clients and then advertise them to other iBGP peers.

| Location from Which a Prefix Is Learned | Are Routes Advertised to Clients? | Are Routes Advertised to Nonclients? |
| --- | --- |  |
| Client                                  | Yes                               | Yes                                  |
| Nonclient                               | Yes                               | No                                   |
| eBGP                                    | Yes                               | Yes                                  |
One (or more) RR servers, and their clients, create a single RR cluster. A BGP design using RRs can consist of 
- Clusters with multiple RRs in a cluster 
- Multiple clusters, although using multiple clusters makes sense only when physical redundancy exists as well

With multiple clusters, at least one RR from a cluster must be peered with at least one RR in each of the other clusters. Typically, all RRs are peered directly, creating a full mesh of RR iBGP peers among RRs. Also, if some routers are nonclients, they should be included in the full mesh of RRs

If you consider the logic summary in it appears that routing loops are not only possible but probable with this design. However, the RR feature uses several tools to prevent loops, as follows: 
- CLUSTER_LIST: RRs add their cluster ID into a BGP PA called the CLUSTER_LIST before sending an Update. When receiving a BGP Update, RRs discard received prefixes for which their cluster ID already appears. As with AS_PATH for confederations, this prevents RRs from looping advertisements between clusters. 
- ORIGINATOR_ID: This PA lists the RID of the first iBGP peer to advertise the route into the AS. If a router sees its own BGP ID as the ORIGINATOR_ID in a received route, it does not use or propagate the route. 
- Only advertise the best routes: RRs reflect routes only if the RR considers the route to be a “best” route in its own BGP table. This further limits the routes reflected by the RR. (It also has a positive effect compared with confederations in that an average router sees fewer, typically useless, redundant routes.)
