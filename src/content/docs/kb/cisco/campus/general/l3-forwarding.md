---
title: L3 Forwarding
tags:
  - general
status: draft
version: 0.0.1
---

There are two main methods for layer 3 forwarding:
- Forwarding to devices in the same subnet
- Forwarding to devices on a different subnet   
Packet Routing
The device checks it’s local routing table to identify it’s nexthop, which can be learned in a few ways:
- Stating routing entry
- Default gateway entry, essentially a static route
- Routing Protocol like OSPF or similar
