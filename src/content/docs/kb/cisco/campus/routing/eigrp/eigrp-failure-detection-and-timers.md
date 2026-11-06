---
title: EIGRP Failure Detection and Timers
tags:
  - eigrp
status: draft
version: 0.0.1
---

A secondary function for the EIGRP hello packets is to ensure that EIGRP neighbors
are still healthy and available. EIGRP hello packets are sent out in intervals
determined by the hello timer.
  
EIGRP uses a second timer for the hold time, which is the amount of time EIGRP
deems the router reachable and functioning. If the hold time reaches 0, EIGRP
declares the neighbor unreachable and notifies DUAL of a topology change.
