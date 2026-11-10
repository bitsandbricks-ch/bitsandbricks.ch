---
title: STP - MST - Region as the Root Bridge
tags:
  - stp
  - mst
status: draft
version: 0.0.1
---

Making the MST region the root bridge ensures that all region boundary ports flood the same ISST instance BPDU to all the VLANs in the PVST topology

Making the IST instance more preferable than any other switch in the PVST+ topology enables this design. The MST region appears as a single entity and the PVST+ switches detect the alternate link and place it into a blocking state

![](https://lh6.googleusercontent.com/0dSa9o2RPRwdlNazHPAcyjjUM7urxxnNqskDg8R56VtrcJdnIdjy62iQiaNfUjoPhmOTvEnlSkRyVMkUHHdDp1TsLLEB9uwDBCL2wFNiK8guTmYYUr2plvREUntbroyI6sUHDb7Kom4yFZMBaKm0b3w)
