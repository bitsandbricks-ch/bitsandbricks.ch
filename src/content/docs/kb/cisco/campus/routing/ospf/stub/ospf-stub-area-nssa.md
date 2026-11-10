---
title: OSPF Stub Area NSSA
tags:
  - stub
  - ospf
status: draft
version: 0.0.1
---

No type 5 external LSA
ASBR allowed

So what if you want an area to be a stub area, but you also have an ASBR in this area? You can use the NSSA (not-so-stubby-area). This is the same thing as the stub area except that you are allowed to have an ASBR within the area. How does it work? This is where the type 7 external LSA kicks in. Since we are not allowed to use the type 5 external LSA, we’ll use a new LSA type.
