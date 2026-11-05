---
title: "Route summarisation"
description: "Advertise one prefix instead of many."
tags: [routing]
verified: "2026-08"
sample: true
---

Summarising 10.1.0.0/24 to 10.1.3.0/24 as 10.1.0.0/22 hides changes inside the block from the
rest of the network. In BGP the same idea is aggregation, see [BGP basics](/kb/routing/bgp/bgp-basics/).
