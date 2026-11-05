---
title: "Route-maps and prefix-lists"
description: "Matching prefixes and changing attributes."
tags: [bgp, policy]
verified: "2026-07"
sample: true
---

```
ip prefix-list LAB seq 10 permit 10.0.0.0/8 le 24
route-map FROM-LAB permit 10
 match ip address prefix-list LAB
 set local-preference 200
```

Used on sessions from [BGP basics](/kb/routing/bgp/bgp-basics/).
