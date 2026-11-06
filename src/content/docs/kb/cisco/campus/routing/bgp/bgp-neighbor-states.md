---
title: BGP Neighbor States
tags:
  - bgp
status: draft
version: 0.0.1
---

| State        | Listen for TCP | Initiate TCP? | TCP Up? | Open Sent? | Open Received | Neighbor Up? |
|  | -- | - | - | ---- | - |  |
| Idle         | No             |               |         |            |               |              |
| Connect      | Yes            |               |         |            |               |              |
| Active       | Yes            | Yes           |         |            |               |              |
| Open sent    | Yes            | Yes           | Yes     | Yes        |               |              |
| Open confirm | Yes            | Yes           | Yes     | Yes        | Yes           |              |
| Established  | Yes            | Yes           | Yes     | Yes        | Yes           | Yes          |
