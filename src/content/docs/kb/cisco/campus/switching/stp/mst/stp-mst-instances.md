---
title: STP - MST - Instances
tags:
  - stp
  - mst
status: draft
version: 0.0.1
---

MST uses a special STP instance called the internal spanning tree (IST), which is always the

first instance, instance 0. The IST runs on all switch port interfaces for switches in the MST

region, regardless of the VLANs associated with the ports. Additional information about

other MSTIs is included (nested) in the IST BPDU that is transmitted throughout the MST

Region

|   |
|---|
|Note:  Cisco supports up to 16 MST instances by default. The IST is always instance 0, so instances 1 to 15 can support other VLANs. There is not a special name for instances 1 to 15; they are simply known as MSTIs.|
