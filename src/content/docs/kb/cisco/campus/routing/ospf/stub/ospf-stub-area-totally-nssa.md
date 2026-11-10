---
title: OSPF Stub Area Totally NSSA
tags:
  - stub
  - ospf
status: draft
version: 0.0.1
---

No type 3 summary LSA
No type 5 external LSA
ASBR allowed

If you want to block type 3 summary LSAs and type 5 external LSAs but still need an ASBR within the totally stub area you can turn it into a totally NSSA (totally not-so-stubby-area).  This will block both LSA types, but you can still have an ASBR in this area type.
