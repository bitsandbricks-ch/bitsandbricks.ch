---
title: EIGRP Metric - Classic Metric
tags:
  - eigrp
status: draft
version: 0.0.1
---

$$
    Metric = [(K_1 * BW + \frac{K_2 * BW }{256 - Load}+K_3 * Delay) * \frac{K_5}{K_4 + Reliability}]
$$
EIGRP uses K values to define which factors the formula uses and the impact associated with a factor when calculating the metric. A common misconception is that the K values directly apply to bandwidth, load, delay, or reliability; this is not accurate. For example, K1 and K2 both reference bandwidth (BW).

BW represents the slowest link in the path, scaled to a 10 Gbps link (107). Link speed is collected from the configured interface bandwidth on an interface. Delay is the total measure of delay in the path, measured in tens of microseconds (μs).

###### Classic Metric Formula with Definitions

The EIGRP formula is based on the IGRP metric formula, except the output is multiplied by 256 to change the metric from 24 bits to 32 bits. Taking these definitions into consideration

$$
    Metric = 256 * [(K_1 * \frac{10^7}{Min. Bw} + \frac{\frac{10^7}{K_2 * Min. Bw} }{256 - Load}+\frac{K_3 * Total Delay}{10}) * \frac{K_5}{K_4 + Reliability}]
$$

###### Classic Metric Formula with default K Values:
$$
    Metric = 256 * [(1 * \frac{10^7}{Min. Bw} + \frac{\frac{10^7}{0 * Min. Bw} }{256 - Load}+\frac{1 * Total Delay}{10}) * \frac{0}{0 + Reliability}]
$$

The above simplified:
$$
    Metric = 256 * [(\frac{10^7}{Min. Bw} +\frac{Total Delay}{10})
$$
