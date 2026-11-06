---
title: BGP Multiprotocol
tags:
  - mp-bgp
  - bgp
status: draft
version: 0.0.1
---

This extension allows the advertisement of customer Virtual Private Network (VPN) routes between provider edge (PE) devices that were injected into customer edge (CE) devices. These pre- fixes can be learned through a number of dynamic methods to include standard BGP-4, EIGRP, OSPF, or static routes.

We are required to run Multiprotocol BGP (MP-BGP) only within the service provider cloud. As such, each MP-BGP session is an internal BGP session. The session is consid- ered internal because of the fact that the session is formed between two routers that belong to the same autonomous system. MP-iBGP is required within the MPLS/VPN architecture because the BGP update needs to carry more information than just an IPv4 address. As an example, in the case of the Multiprotocol Label Switching (MPLS) L3 VPNs, the update must communicate the VPN IPv4 address, MPLS label information, and extended or standard BGP communities.

As mentioned, the actual nature of these extensions to the BGP is to provide additional capabilities that allow BGP to carry more information than just the IPv4 address and the typical BGP attributes

Specifically, MP-BGP employs two new Optional nontransitive attributes: 
Multiprotocol Reachable NLRI (MP_REACH_NLRI) announces new multiprotocol routes.
Multiprotocol Unreachable NLRI (MP_UNREACH_NLRI) serves to revoke the routes previously announced by MP_REACH_NLRI.

| Purpose                                       | Command                                                                                                                                                 |
| --- | - |
| Address family information                    | The address family information identifies the Network layer protocol that is being carried within the Update.                                           |
| Next-hop information                          | The next-hop information is the next-hop address of the next router in the path to the destination.                                                     |
| NLRI (network layer reachability information) | The NLRI manages the addition or withdrawal of multiprotocol routes and the next-hop address, and the NLRI prefixes must be in the same address family. |
