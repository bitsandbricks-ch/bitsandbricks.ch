---
title: Process Switching
tags:
  - general
status: draft
version: 0.0.1
---

Process Switching, also referred to as Software Switching or slow path, is a switching mechanism in which the CPU on a router is in charge of packet switching

The following type of packets are process switched:
- Packets sources or destined to the router
- Packets that are too complex for hardware to hande, Example: IP packets with IP options
- Packets that require extra information that is not currently know Example ARP

Packets that can’t be CEF switched are called punted
