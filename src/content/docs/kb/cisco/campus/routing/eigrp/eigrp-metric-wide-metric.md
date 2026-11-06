---
title: EIGRP Metric - Wide Metric
tags:
  - eigrp
status: draft
version: 0.0.1
---

Wide Metric Formula with default K Values:

Metric = 65535 *[( K1 *107Min. Bandwidth+ K2 * 107Min. Bandwidth256 -Load+K3 * Delay10 + K6 * Extended) *00 + Reliability]

K6 has been introduced with Wide Metric support and is used to allow for Extended Attributes, which can be used to reflect in a higher aggregate metric than those having lower energy usage
