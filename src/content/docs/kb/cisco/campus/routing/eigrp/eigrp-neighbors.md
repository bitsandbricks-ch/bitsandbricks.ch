---
title: EIGRP Neighbors
tags:
  - eigrp
status: draft
version: 0.0.1
---

EIGRP neighbors exchange the entire routing table when forming an adjacency, and they advertise only incremental updates as topology changes occur within a network. The neighbor adjacency table is vital for tracking neighbor status and the updates sent to each Neighbor. EIGRP uses five different packet types to communicate with other routers

|Type|Packet Name|Function|
|---|---|---|
|1|Hello|Used for discovery of EIGRP neighbors and for detecting when a neighbor is no longer available|
|2|Request|Used to get specific information from one or more neighbors|
|3|Update|Used to transmit routing and reachability information with other EIGRP neighbors|
|4|Query|Sent out to search for another path during convergence|
|5|Reply|Sent in response to a query or update packet|

Communication between routers is done with multicast, using the group address 224.0.0.10 when possible.
