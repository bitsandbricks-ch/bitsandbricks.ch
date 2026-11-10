---
title: OSPF Prefix Suppression
tags:
  - filtering
  - ospf
status: draft
version: 0.0.1
---

When enabled, it suppresses the intra-area transit links on the routers. 

This suppression is performed by omitting prefix information from the LSDB for those intra-area links. This is performed without losing the adjacency with the OSPF neighbor. OSPF prefix suppression is a form of intra-area route suppression because it is designed to hide unnecessary transit link information from the OSPF domain. This form of filtering does not break the rules of LSDB consistency because the router configured for prefix suppression removes the prefix from the LSAs it originates. By altering its own self-generated LSA it follows the rule outlined in the above where all routers within the area agree that those prefixes do not exist in that LSA. This feature can be enabled using the ip ospf prefix-suppression command in interface configuration mode for which the prefix should be suppressed. 
According to RFC 6860, the RFC that describes how to hide transit links in the OSPF topology, the prefix calculated from a Type-2 Network LSA as /32 should be ignored. In other words, the routers will not add the prefix to their routing tables.
