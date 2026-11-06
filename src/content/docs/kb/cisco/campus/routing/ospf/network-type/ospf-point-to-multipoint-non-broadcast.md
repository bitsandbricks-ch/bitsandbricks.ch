---
title: OSPF Point-to-Multipoint Non-Broadcast
tags:
  - ospf
  - network-type
status: draft
version: 0.0.1
---

Change the OSPF Link type to point-to-point
```
interface Tun 123
 ip ospf network point-to-multipoint non-broadcast

router ospf 1
 neighbor x.x.x.x
```
