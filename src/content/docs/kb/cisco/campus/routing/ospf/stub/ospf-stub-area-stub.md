---
title: OSPF Stub Area Stub
tags:
  - stub
  - ospf
status: draft
version: 0.0.1
---

No type 5 external LSA
No ASBR allowed

If you configure an area as a stub, it will block all type 5 external LSAs. All the prefixes you redistributed into OSPF from another routing protocol are not welcome in the stub area. Since you are not allowed to have type 5 external LSAs in the stub area, it’s also impossible to have an ASBR in the stub area. You can still learn networks from other OSPF areas.
