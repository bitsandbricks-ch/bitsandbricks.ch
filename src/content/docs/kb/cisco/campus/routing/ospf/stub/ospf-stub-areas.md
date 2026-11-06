---
title: OSPF Stub Areas
tags:
  - stub
  - ospf
status: draft
version: 0.0.1
---

OSPF has special area types called stub areas
Let me start by summing up the special area types:

- Stub area
- Totally stub area
- NSSA (not so stubby area)
- Totally NSSA (totally not so stubby area)

Here are some of the rules when dealing with the stub and totally stub areas:

- There should be at least one ABR in the area.
- All routers in the stub area have to be configured as a stub routers.
- There is no ASBR within the stub or totally stub area.
- The backbone area (0) cannot become a stub or totally stub area.
