---
title: OSFP Network Type Point-to-Point
tags:
  - network-types
  - ospf
status: draft
version: 0.0.1
---

Here’s what you need to know about OSPF point-to-point:

- Automatic neighbor discovery so no need to configure OSPF neighbors yourself.
- No DR/BDR election since OSPF sees the network as a collection of point-to-point links.
- Normally uses for point-to-point sub-interfaces with an IP subnet per link.
- Can also be used with multiple PVCs using only one subnet.

> [!note]
Network Type Point-to-Point is also used to configure loopback interface to send the configured subnetmask instead of /32
