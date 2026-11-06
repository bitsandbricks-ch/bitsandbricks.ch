---
title: BGP Injecting Routes & Prefixes
tags:
  - bgp
status: draft
version: 0.0.1
---

| Command                                 | Component Subnets Removed | Routes It Can Summarize                                                    |
| --- | - | -- |
| auto-summary (with redistribution)      | All                       | Only those injected into BGP on that router using the redistribute command |
| aggregate-address                       | All,none or a subset      | Any prefixes already in the BGP table                                      |
| auto-summary (with the network command) | None                      | Only those injected into BGP on that router using the network command      |
## BGP network Command

The BGP network command instructs that router’s BGP process to do the following: 
Look for a route in the router’s current IP routing table that exactly matches the parameters of the network command; if the IP route exists, put the equivalent NLRI into the local BGP table.

With this logic, connected routes, static routes, or IGP routes could be taken from the IP routing table and placed into the BGP table for later advertisement. When the router removes that route from its IP routing table, BGP then removes the NLRI from the BGP table, and notifies neighbors that the route has been withdrawn. Note that the IP route must be matched exactly when the no auto-summary command is configured or used by default.

`network {network-number [mask network-mask]} [route-map map-tag]`
## Redistributing from an IGP, Static, or Connected Route
The BGP redistribute subcommand can redistribute static, connected, and IGP-learned routes.

BGP does not use the concept of calculating a metric for each alternate route to reach a particular prefix. Instead, BGP uses a stepwise decision process that examines various PAs to determine the best route. As a result, redistribution into BGP does not require any consideration of setting metrics. However, a router might need to apply a route map to the redistribution function to manipulate PAs, which in turn affects the BGP decision pro- cess. If a metric is assigned to a route injected into BGP, BGP assigns that metric value to the BGP Multi-Exit Discriminator (MED) PA, which is commonly referred to as metric.

> *Note: Although this point is not unique to BGP, keep in mind that redistribution from an IGP causes two types of routes to be taken from the routing table—those learned by the routing protocol and those connected routes for which that routing protocol matches with a network command.*

## Impact of Auto-Summary on Redistributed Routes and the network Command

As it does with IGPs, the BGP auto-summary command causes a classful summary route to be created if any component subnet of that summary exists. However, unlike IGPs, the BGP auto-summary router subcommand causes BGP to summarize only those routes injected because of redistribution on that router. BGP auto-summary does not look for classful network boundaries in the topology, and it does not look at routes already in the BGP table. It simply looks for routes injected into the BGP because of the redistribute and network commands on that same router.

The logic differs slightly based on whether the route is injected with the redistribute command or the network command. The logic for the two commands is summarized as follows: 
- redistribute: If any subnets of a classful network would be redistributed, do not redistribute, but instead redistribute a route for the classful network. 
- network: If a network command lists a classful network number, with the classful default mask or no mask, and any subnets of the classful network exist, inject a route for the classful network.

## Manual Summaries and the AS_PATH Path Attribute
Additionally, BGP can use manual route summarization to advertise summary routes to neighboring routers, causing the neigh- boring routers to learn additional BGP routes. 

BGP manual summarization with the aggregate-address command differs significantly from using the auto-summary command. It can summarize based on any routes in the BGP table, creating a summary of any prefix length. It does not always suppress the advertisement of the component subnets, although it can be configured to do so. The aggregate route must include the AS_PATH PA, just like it is required for every other NLRI in the BGP table. However, to fully understand what this command does, you need to take a closer look at the BGP Path Attribute AS_PATH. 
The aggregate-address command can create a summary route for which the AS_SEQ must be null. 
When the component subnets of the summary route have differing AS_SEQ values, the router simply can’t create an accurate representation of AS_SEQ, so it uses a null AS_SEQ. However, this action introduces the possibility of creating routing loops, because the contents of AS_PATH, specifically AS_SEQ, are used so that when a router receives an update, it can ignore prefixes for which its own ASN is listed. The AS_PATH AS_SET segment solves the problem when the summary route has a null AS_SEQ. The AS_SET segment holds an unordered list of all the ASNs in all the component subnets AS_SEQ segments.

The following list summarizes the actions taken by the aggregate-address command when it creates a summary route: 
- It does not create the summary if the BGP table does not currently have any routes for NLRI inside the summary. 
- If all the component subnets are withdrawn from the aggregating router’s BGP table, it also then withdraws the aggregate. (In other words, the router tells its neighbors that the aggregate route is no longer valid.) 
- It sets the NEXT_HOP address of the summary, as listed in the local BGP table, as 0.0.0.0. 
- It sets the NEXT_HOP address of the summary route, as advertised to neighbors, to the router’s update source IP address for each neighbor, respectively. 
- If the component subnets inside the summary all have the same AS_SEQ, it sets the new summary route’s AS_SEQ to be exactly like the AS_SEQ of the component subnets. 
- If the AS_SEQ of the component subnets differs in any way, it sets the AS_SEQ of the new summary route to null. 
- When the as-set option has been configured, the router creates an AS_SET segment for the aggregate route, but only if the summary route’s AS_SEQ is null. 
- As usual, if the summary is advertised to an eBGP peer, the router prepends its own ASN to the AS_SEQ before sending the Update. 
- It suppresses the advertisement of all component subnets if the summary-only key- word is used, advertises all of them if the summary-only keyword is omitted, or advertises a subset if the suppress-map option is configured.
