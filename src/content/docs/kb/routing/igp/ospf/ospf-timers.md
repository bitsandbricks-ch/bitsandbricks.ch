---
title: "OSPF timers and BFD"
description: "Hello and dead timers, and why BFD is the better way to detect failures fast."
tags: [ospf, bfd]
verified: "2026-03"
sample: true
---

The default hello is 10 seconds and the dead interval 40 seconds on broadcast links. Lowering
them speeds up failure detection but costs CPU on every neighbour. [BFD](/kb/routing/bfd-basics/)
detects failures in milliseconds and tells OSPF, so the timers can stay at their defaults.

Back to [OSPF areas](../ospf-areas/).
