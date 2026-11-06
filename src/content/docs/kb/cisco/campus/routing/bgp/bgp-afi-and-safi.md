---
title: BGP AFI and SAFI
tags:
  - bgp
status: draft
version: 0.0.1
---

BGP is a protocol that is able to share routing information between BGP routers. Multi-Protocol BGP (MP-BGP) is an extension of BGP that allows it to carry additional information about multiple protocols including IPv6, IPv6, NHRP, VPNv4, VPNv6 and others.

Within the extensions of MP-BGP, we have both AFI and SAFI. These are further explained below.

Address Family Indicator (AFI) and Subsequent Address Family Indicator (SAFI) are fields within Multi-Protocol BGP (MP-BGP) extensions. The information in these fields is sent as part of the neighbor capability exchange during the process of becoming BGP peers. The information in these fields is used to tell the remote peer what address family (IPv4, IPv6, VPNv4, VPNv6 etc.) and what specific sub-address family (multicast or unicast) the local BGP router will be transporting routes for.
