---
title: OSPF States
tags:
  - ospf
status: draft
version: 0.0.1
---

1. Down: no OSPF neighbors have been detected at this moment.
2. Init: Hello packet received.
3. Two-way: own router ID found in received hello packet.
4. Exstart: master and slave roles determined.
5. Exchange: database description packets (DBD) are sent.
6. Loading: exchange of LSRs (Link state request) and LSUs (Link state update) packets.
7. Full: OSPF routers now have an adjacency.
