---
title: OSFP Network Type Point-to-Multipoint Non-Broadcast
tags:
  - network-types
  - ospf
status: draft
version: 0.0.1
---

There are a couple of things that you need to be aware of:

- No Automatic neighbor discovery, so you need to configure OSPF neighbors yourself!
- No DR/BDR election since OSPF sees the network as a collection of point-to-point links.
- Only a single IP subnet is used in the topology above.
