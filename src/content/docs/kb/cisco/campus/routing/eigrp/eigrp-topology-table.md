---
title: EIGRP Topology Table
tags:
  - eigrp
status: draft
version: 0.0.1
---

EIGRP contains a topology table that makes it different from a "true" distance vector routing protocol. EIGRP topology table is a vital component to DUAL and contains information to identify loop-free backup routes. The topology table contains all the network prefixes advertised within an EIGRP autonomous system. Each entry in the table contains the following:
- Network prefix
- EIGRP neighbors that have advertised that prefix
- Metrics from each neighbor (for example, reported distance, hop count)
- Values used for calculating the metric (for example, load, reliability, total delay, minimum bandwidth)
