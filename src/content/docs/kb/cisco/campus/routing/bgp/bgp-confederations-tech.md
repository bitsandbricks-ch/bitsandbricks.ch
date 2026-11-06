---
title: BGP Confederations
tags:
  - bgp
status: draft
version: 0.0.1
---

An AS using BGP confederations, as defined in RFC 5065, separates each router in the AS into one of several confederation subautonomous systems. Peers inside the same sub-AS are considered to be confederation iBGP peers, and routers in different subautonomous systems are considered to be confederation eBGP peers.

Confederations propagate routes to all routers, without a full mesh of peers inside the entire AS. To do so, confederation eBGP peer connections act like true eBGP peers in some respects. In a single sub-AS, the confederation iBGP peers must be fully meshed, because they act exactly like normal iBGP peers—in other words, they do not advertise iBGP routes to each other. However, confederation eBGP peers act like eBGP peers in that they can advertise iBGP routes learned inside their confederation sub-AS into another confederation sub-AS.

Confederations prevent loops inside a confederation AS by using the AS_PATH PA. BGP routers in a confederation add the subautonomous systems into the AS_PATH as part of an AS_PATH segment called the AS_CONFED _SEQ. (The AS_PATH consists of up to four different components, called segments—AS_SEQ, AS_SET, AS_CONFED_ SEQ, and AS_CONFED_SET; see the earlier section “Manual Summaries and the AS_PATH Path Attribute” for more information on AS_SEQ and AS_SET.)

The following list summarizes the key topics regarding confederations: 
- Inside a sub-AS, full mesh is required, because full iBGP rules are in effect. 
- The confederation eBGP connections act like normal eBGP connections in that iBGP routes are advertised as long as the AS_PATH implies that such an advertisement would not cause a loop. 
- Confederation eBGP connections also act like normal eBGP connections regarding Time to Live (TTL), because all packets use a TTL of 1 by default. (TTL can be changed with the neighbor ebgp-multihop command.) 
- Confederation eBGP connections act like iBGP connections in every other regard— for example, the NEXT_HOP is not changed by default. 
- Confederation ASNs are not considered part of the length of the AS_PATH when a router chooses the best routes based on the shortest AS_PATH. 
- Confederation routers remove the confederation ASNs from the AS_PATH in Updates sent outside the confederation; therefore, other routers do not know that a confederation was used.
