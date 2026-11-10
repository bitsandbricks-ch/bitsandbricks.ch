---
title: SPAN - Remote Switched Port Analyzer (RSPAN)
tags:
  - span
status: draft
version: 0.0.1
---

You can capture network traffic on a remote switch and send a copy of the network traffic to the local switch through Layer 2 (switching) toward a local port attached to some sort of traffic analyzer.

A switch with the RSPAN VLAN operates differently from a typical switch:
- MAC addresses are not learned on ports associated with the RSPAN VLAN. This ensures that the switch does not try to use the port associated with the RSPAN VLAN to transmit data to the end host, which in turn ensures that the normal forwarding path is maintained.
- Traffic is flooded out all the ports associated to the RSPAN VLAN. The RSPAN VLAN should not be associated with ports that are not trunk ports between the source and destination switches.

The configuration for RSPAN is straightforward: A VLAN is created and then identified as an RSPAN VLAN with the command remote-span. 

On the source port switch, the source ports are selected just as explained earlier for local SPAN. However, the destination is the RSPAN VLAN, which is set with the command monitor session session-id destination remote vlan rspanvlan-id.
On the destination port switch, the destination ports are selected just as explained earlier for local SPAN. However, the source is the RSPAN VLAN, and this is set with the command monitor session session-id source remote vlan rspanvlan-id.

While the session-id is locally significant, keeping it the same on both the source and destination switches prevents confusion.
