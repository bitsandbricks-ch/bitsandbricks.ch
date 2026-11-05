---
title: "OSPF areas, the short version"
description: "Why OSPF networks are split into areas and what changes in the link-state database."
tags: [ospf, routing]
verified: "2026-10"
sample: true
---

## Why areas

Every router in an area holds the same link-state database. Splitting a large network into
areas keeps those databases smaller and limits how far a flapping link is felt. All areas
attach to the backbone, area 0, through area border routers (ABRs).

```
router ospf 1
 router-id 10.0.0.1
 area 10 stub
 passive-interface default
```

## Related

- The LSA types that cross area borders: [LSA types](../lsa-types/)
- Summarising at the ABR: [route summarisation](/kb/routing/igp/route-summarisation/)
