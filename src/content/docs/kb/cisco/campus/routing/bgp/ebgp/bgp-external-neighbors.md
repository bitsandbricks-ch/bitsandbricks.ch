---
title: BGP External Neighbors
tags:
  - bgp
---

#todo/cleanup 

When a router attempts to form a BGP peering with a neighbor that is an eBGP peer, the router performs an implicit default check on the peering address, more commonly known as the connected check. This check ensures that the local router’s route to reach the peer’s IP address, the address specified in the neighbor command, appears as a directly-connected route in the local routers routing table. If the peering address is not a directly-connected route, the check fails. As a result, TCP connections cannot be opened, and the router logs the message “Active open failed - no route to peer”.
The BGP sanity check can be disabled too. This is done using the neighbor neighbor-address disableconnected-check command. With this command, the router will suspend its sanity check and utilize any route in the routing table to start the active open process except for a default route.

The theory is as follows. R1 sends a TCP SYN packet to R2 with a TTL value of 1. This TCP SYN is destined to R2’s lo0 interface 2.2.2.2. When R2 receives the packet, it decrements the TTL value to 0. With the TTL value now at zero, R2 would be unable to route the packet to its Lo0 interface preventing the session from being established. The above, however, disproves this theory. R1 and R2 are able to establish an eBGP peering without changing the TTL value. This is because, even though the peerings are established over loopback interfaces, the TTL value restriction only applies to actual router hops. Packets routed to a loopback interface do not incur this penalty because they are still being consumed by the local router and are not being routed to a remote subnet or device.

## ebgp Multihop

The behavior makes sense. If the router is told the peer is only a single hop away, then the peer should be directly-connected to the local router. This means that using the ebgp-multihop command with a TTL value of 1 will still require the use of the disable-connected-check command. 

The task explicitly forbids the use of the disable-connected-check command, invalidating the option. There is a hidden effect to the ebgp-multihop command. If set to a value of 1 the connected check is retained. However, if set to a value higher than one, the command silently disables the connected check.
