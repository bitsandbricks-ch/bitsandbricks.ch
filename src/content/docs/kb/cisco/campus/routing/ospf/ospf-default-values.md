---
title: OSPF Default Values
tags:
  - ospf
status: draft
version: 0.0.1
---

### Timers

| Network Type        | Type           | Value  | Desc           |
| ------------------- | -------------- | ------ | -------------- |
| point-to-point      | Hello Timer    | 10     |                |
| point-to-multipoint | Hello Timer    | 30     |                |
| *                   | Start Interval | 0ms    | LSA Rate Limit |
| *                   | Hold Interval  | 5000ms | LSA Rate Limit |
| *                   | Max Interval   | 5000ms | LSA Rate Limit |
| *                   | LSA Arrival    | 1000ms | LSA Rate Limit |
### Specials
| Type                      | Value      | Desc                                                |
| ------------------------- | ---------- | --------------------------------------------------- |
| BGP No Redistribution Tag | 3758096384 | OSPF Tagging BGP         |
| LSInfinity Metric         | 16777215   | Value that deems the LSA as unreachable in the LSDB |
>[!info]
Setting the hello-interval automatically adjusts the dead interval to four time the hello interval
