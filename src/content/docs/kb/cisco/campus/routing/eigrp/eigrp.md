---
title: EIGRP
tags:
  - eigrp
status: draft
version: 0.0.1
---

EIGRP overcomes the deficiencies of other distance vector routing protocols like RIP with features such as unequal-cost load balancing, support for networks 255 hops away, and rapid convergence features. 

EIGRP uses a diffusing update algorithm (DUAL) to  identify network paths and enable fast convergence using precalculated loop-free backup paths. 
Most distance vector routing protocols use hop count as the metric for routing decisions. However, using hop count for path selection does not take into account link speed and total delay. EIGRP adds to the route selection algorithm logic that uses factors outside hop count.
