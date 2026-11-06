---
title: OSPF Stub Areas Totally Stub
tags:
  - stub
  - ospf
status: draft
version: 0.0.1
---

No type 3 summary LSA
No type 5 external LSA
No ASBR allowed

What about totally stub? This area type will block type 5 external LSAs and type 3 summary LSAs. It’s impossible to have an ASBR in the totally stub area since type 5 external LSAs are blocked.
