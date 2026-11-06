---
title: OSPF Packets
tags:
  - ospf
status: draft
version: 0.0.1
---

show ip ospf neighbor

- Hello: neighbor discovery, build neighbor adjacencies and maintain them.
- DBD: This packet is used to check if the LSDB between the two routers is the same. The DBD is a summary of the LSDB.
- LSR: Requests specific link-state records from an OSPF neighbor.
- LSU: Sends specific link-state records that were requested. This packet is like an envelope with multiple LSAs in it.
- LSAck: OSPF is a reliable protocol, so we have a packet to acknowledge the others.
