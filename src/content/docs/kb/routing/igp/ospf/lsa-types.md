---
title: "LSA types cheat sheet"
description: "Which LSA does what, and where it is flooded."
tags: [ospf, routing]
verified: "2026-09"
sample: true
---

| Type | Name | Flooded |
| --- | --- | --- |
| 1 | Router | within the area |
| 2 | Network | within the area |
| 3 | Summary | into other areas by the ABR |
| 4 | ASBR summary | into other areas by the ABR |
| 5 | External | everywhere except stub areas |
| 7 | NSSA external | within the NSSA |

See [OSPF areas](../ospf-areas/) for why the borders matter.
