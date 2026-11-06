---
title: STP - MST - Region not as the Root Bridge
tags:
  - stp
  - mst
status: draft
version: 0.0.1
---

In this scenario, the MST region boundary ports can only block or forward for all VLANs.
Remember that only the VLAN 1 PVST BPDU is used for the IST and that the IST BPDU is
a one-to-many translation of IST BPDUs to all PVST BPDUs 
 
There is not an option to load balance traffic because the IST instance must remain consistent.
If an MST switch detects a better BPDU for a specific VLAN on a boundary port, the switch
will use BPDU guard to block this port. The port will then be placed into a root inconsistent
state. While this may isolate downstream switches, it is done to ensure a loop-free topology, this is called the PVST simulation check.
