---
title: OSPF Non-Broadcast Neighbor
tags:
  - ospf
status: draft
version: 0.0.1
---

Change the cost of routes from a specific neighbor
```
router ospf 1
 neighbor x.x.x.x cost 90
```

>[!warning]
>The neighbor command only works if the network type is non-broadcast
