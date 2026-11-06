---
title: EIGRP Metric - Metric Calculation
tags:
  - eigrp
status: draft
version: 0.0.1
---

Metric calculation uses bandwidth and delay by default, but it can include interface load and reliability, too

- EIGRP uses K values to define which factors the formula uses and the associated impact of a factor when calculating the metric. (0 or 1)
- BW represents the slowest link in the path scaled to a 10 Gbps link in KB
- Delay is the total measure of delay in the path, measured in tens of microseconds (μs).
