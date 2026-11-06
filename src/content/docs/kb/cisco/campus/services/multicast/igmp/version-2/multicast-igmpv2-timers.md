---
title: Multicast IGMPv2 Timers
tags:
  - multicast
  - version-2
status: draft
version: 0.0.1
---

| Timer | Usage | Default Value |
| -- | -- | ----- |
| Query Interval | A time period between General Queries sent by a router. | 60 seconds |
| Query Response Interval | The maximum response time for hosts to respond to the periodic general Queries. | 10 seconds; can be between 0.1 and 25.5 seconds |
| Group Membership Interval | A time period during which, if a router does not receive an IGMP Report, the router concludes that there are no more members of the group on the subnet. | 260 seconds |
| Other Querier Present Interval | A time period during which, if the IGMPv2 nonquerier routers do not receive an IGMP Query from the querier router, the nonquerier routers conclude that the querier is dead. | 255 seconds |
| Last Member Query Interval | The maximum response time inserted by IGMPv2 routers into the Group-Specific Queries and the time period between two consecutive Group-Specific Queries sent for the same group. | 1 second |
| Version 1 Router Present Timeout | A time period during which, if an IGMPv2 host does not receive an IGMPv1 Query, the IGMPv2 host concludes that there are no IGMPv1 routers present and starts sending IGMPv2 messages. | 400 seconds |
