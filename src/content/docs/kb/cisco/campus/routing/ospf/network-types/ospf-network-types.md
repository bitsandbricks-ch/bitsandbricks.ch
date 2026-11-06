---
title: OSPF Network Types
tags:
  - network-types
  - ospf
status: draft
version: 0.0.1
---

There are 5 OSPF network types:

- Non-Broadcast
- Broadcast
- Point-to-Multipoint
- Point-to-Multipoint Non-Broadcast
- Point-to-Point

I made non-broadcast and broadcast blue because these two network types have something in common. They both require a DR/BDR election and basically, you are telling OSPF that you have a multi-access network. In other words…every router can reach any other router. This can be challenging with frame-relay because this is not always the case if you have a partial mesh or hub and spoke configuration.

Point-to-multipoint, point-to-multipoint non-broadcast, and point-to-point are in red because they have one thing in common: We tell OSPF that we have a "bunch of point-to-point" links. As you will see in my demonstration, the "blue" network types have different next-hop behavior from the "red" network types.
