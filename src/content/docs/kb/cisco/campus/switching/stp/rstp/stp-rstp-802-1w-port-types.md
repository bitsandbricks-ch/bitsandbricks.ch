---
title: STP - RSTP 802.1W - Port Types
tags:
  - stp
  - rstp
status: draft
version: 0.0.1
---

|   |   |
|---|---|
|Edge port|A port at the edge of the network where hosts connect to the Layer 2 topology with one interface and cannot form a loop.<br><br>These ports directly correlate to ports that have the STP portfast feature enabled.|
|Root port|A port that has the best path cost toward the root bridge.<br><br>There can be only one root port on a switch|
|Point-to-point port|Any port that connects to another RSTP switch with full duplex.|
