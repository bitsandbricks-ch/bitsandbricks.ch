---
title: STP - RSTP - Building the Topology
tags:
  - stp
  - rstp
status: draft
version: 0.0.1
---

1. As the first two switches connect to each other, they verify that they are connected with a point-to-point link by checking the full-duplex status.
2. They establish a handshake with each other to advertise a proposal (in configuration BPDUs) that their interface should be the DP for that segment.
3. There can be only one DP per segment, so each switch identifies whether it is the superior or inferior switch, using the same logic as in 802.1D
4. The inferior switch recognizes that it is inferior and marks its local port as the RP. At that same time, it moves all non-edge ports to a discarding state. At this point in time, the switch has stopped all local switching for non-edge ports.
5. The inferior switch sends an agreement (configuration BPDU) to the root, which signifies to the root bridge that synchronisation is occurring on that switch.
6. The inferior switch moves its RP to a forwarding state. The superior switch moves its DP to a forwarding state, too.
7. The inferior switch repeats the process for any downstream switches connected to it. of one topology (IST) to multiple VLANs (VLANs toward the PVST link). The PVST simulation mechanism is required because PVST+/RSTP topologies do not understand the IST BPDU structure.
