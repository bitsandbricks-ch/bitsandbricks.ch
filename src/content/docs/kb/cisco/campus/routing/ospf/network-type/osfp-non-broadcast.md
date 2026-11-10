---
title: OSFP Non-Broadcast
tags:
  - ospf
  - network-type
status: draft
version: 0.0.1
---

```mermaid
graph TD
```
C[R2] --> B((DMVPN 10.1.1.0/24))
D[R3] --> B((DMVPN 10.1.1.0/24))
E[R4] --> B((DMVPN 10.1.1.0/24))
B((DMVPN 10.1.1.0/24)) --> A[R1]
```
```

Change the OSPF Link type to non broadcast
```
interface Gig 0/0
 ip ospf network non-broadcast
```

With non broadcast the multicast is disabled and the neighbours have to be configured statically
```
router ospf 1
 neighbor 10.1.1.1
 neighbor 10.1.1.2
 neighbor 10.1.1.3
 neighbor 10.1.1.4
```
