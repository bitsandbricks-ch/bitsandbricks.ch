---
title: STP - MST - Region Boundary
tags:
  - stp
  - mst
status: draft
version: 0.0.1
---

The topology for all the MST instances is contained within the IST, which operates internally

to the MST region. An MST region boundary is any port that connects to a switch that is in

a different MST region or that connects to 802.1D or 802.1W BPDUs

MSTIs never interact outside the region. MST switches can detect PVST+ neighbor at MST region boundaries. Propagating the CST (derived from the IST) at the MST region boundary involves a feature called the PVST simulation mechanism.

The PVST simulation mechanism sends out PVST+ (and includes RSTP, too) BPDUs (one for each VLAN), using the information from the IST. To be very explicit, this requires a mapping of one topology (IST) to multiple VLANs (VLANs toward the PVST link). 

The PVST simulation mechanism is required because PVST+/RSTP topologies do not understand the IST BPDU structure.
