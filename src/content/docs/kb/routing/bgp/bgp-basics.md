---
title: "BGP session states and timers"
description: "The states a BGP session goes through and the timers that matter."
tags: [bgp, routing]
verified: "2026-10"
sample: true
---

A session moves through Idle, Connect, Active, OpenSent, OpenConfirm and Established. The
default keepalive is 60 seconds and the hold time 180 seconds. Policy is applied with
[route-maps](/kb/routing/bgp/policy/route-maps/), and [BFD](/kb/routing/bfd-basics/) speeds up failure detection.
