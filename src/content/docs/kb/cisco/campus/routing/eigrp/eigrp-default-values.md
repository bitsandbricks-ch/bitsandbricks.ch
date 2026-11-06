---
title: EIGRP Default Values
tags:
  - eigrp
status: draft
version: 0.0.1
---

| Type              | Value           | Protocol | Desc                                               |
| ----------------- | --------------- | -------- | -------------------------------------------------- |
| Algorithm         | DUAL            |          |                                                    |
| Max hops          | 255             |          |                                                    |
| Multicast Address | 224.0.0.10      | *        | Used for communication between routers             |
| Multicast MAC     | 0100.5E00.000A  | *        |                                                    |
| Protocol Type     | IP Type 88      |          |                                                    |
| K1                | 1               | *        | Bandwidth                                          |
| K2                | 0               | *        | Load                                               |
| K3                | 1               | *        | Delay                                              |
| K4                | 0               | *        | Reliability                                        |
| K5                | 0               | *        | Reliability                                        |
| K6                | 0               | *        | Extended, only in wide metric                      |
| Hello Timer       | 5 seconds       | *        | 60 seconds on slow-speed<br><br>interfaces (<10mb) |
| Hold Timer        | 3 x Hello Timer | *        |                                                    |
