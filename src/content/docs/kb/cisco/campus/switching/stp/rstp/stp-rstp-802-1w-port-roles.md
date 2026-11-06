---
title: STP - RSTP 802.1W - Port Roles
tags:
  - stp
  - rstp
status: draft
version: 0.0.1
---

|   |   |
|---|---|
|Root port (RP)|A network port that connects to the root switch or an upstream switch in the spanning-tree topology.|
|Designated port (DP):|A network port that receives and forwards frames to other switches.<br><br>Designated ports provide connectivity to downstream devices and switches.|
|Alternate port|A network port that provides alternate connectivity toward the root switch through a different switch|
|Backup port|A network port that provides link redundancy toward the current root switch.<br><br>The backup port cannot guarantee connectivity to the root bridge in the event that the upstream switch fails.<br><br>A backup port exists only when multiple links connect between the same switches.|
