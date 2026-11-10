---
title: STP - MST - Issues - VLAN assignment to the IST
tags:
  - stp
  - mst
status: draft
version: 0.0.1
---

Remember that the IST operates across all links in the MST region, regardless of the VLAN assigned to the actual port. The IST topology may not correlate to the access layer and might introduce a blocking port that was not intentional.

There are two solutions for this scenario:

- Move VLAN 10 to an MSTI instance other than the IST. 
- Allow the VLANs associated with the IST on all interswitch (trunk) links.
