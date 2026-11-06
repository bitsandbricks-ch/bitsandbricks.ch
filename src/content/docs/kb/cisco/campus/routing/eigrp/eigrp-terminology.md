---
title: EIGRP Terminology
tags:
  - eigrp
status: draft
version: 0.0.1
---

|                                                               |                                                                                                                                                                                 |     |            |
   | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------- |
   |                                                               | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |     | Definition |
   | The route with the lowest path metric to reach a destination. |                                                                                                                                                                                 |     |            |
   | Successor                                                     | The first next-hop router for the successor route.                                                                                                                              |     |            |
   | Feasible distance (FD)                                        | The metric value for the lowest-metric path to reach a destination.                                                                                                             |     |            |
   | Reported distance (RD)<br><br>(Advertised distance)           | The distance reported by a router to reach a prefix. The reported distance value is the feasible distance for the advertising router.                                           |     |            |
   | Feasibility condition                                         | A condition under which, for a route to be considered a backup route, the reported distance received for that route must be less than the feasible distance calculated locally. |     |            |
   | Feasible successor                                            | A route that satisfies the feasibility condition and is maintained as a backup route.  reported distance < feasible distance                                                    |     |            |
