---
title: BGP Default Routes
tags:
  - bgp
status: draft
version: 0.0.1
---

The final method covered in this chapter for adding routes to a BGP table is to inject default routes into BGP. Default routes can be injected into BGP in one of three ways: 
- By injecting the default using the network command 
- By injecting the default using the redistribute command 
- By injecting a default route into BGP using the neighbor neighbor-id default- originate [route-map route-map-name] BGP subcommand
## Network Command
When you inject a default route into BGP using the network command, a route to 0.0.0.0/0 must exist in the local routing table, and the network 0.0.0.0 command is required. The default IP route can be learned through any means, but if it is removed from the IP routing table, BGP removes the default route from the BGP table. 
## Redistribution
Injecting a default route through redistribution requires an additional configuration command `default-information originate`. The default route must first exist in the IP routing table; for example, a static default route to null0 could be created. Then, the redistribute static command could be used to redistribute that static default route. However, in the special case of the default route, Cisco IOS also requires the default-originate BGP sub-command. 
## Injection
Injecting a default route into BGP by using the `neighbor neighbor-id default-originate [ route-map route-map-name]` BGP subcommand does not add a default route to the local BGP table; instead, it causes the advertisement of a default to the specified neighbor. 

In fact, this method does not even check for the existence of a default route in the IP routing table by default, but it can. With the route-map option, the referenced route map examines the entries in the IP routing table (not the BGP table); if a route map permit clause is matched, the default route is advertised to the neighbor.
