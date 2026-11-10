---
title: Manual Summarization with any Routing Protocol
---

##### EIGRP Summarization 

Summarization can be employed on any router in an EIGRP network, since it is a distance-vector protocol and does not keep a LSDB on all routers on the network.  Summary routes in EIGRP have an AD value of 5.  The summary router will advertise the summary route with an outgoing interface of Null0 for loop-prevention purposes. 

EIGRP defaults to auto-summarisation on IOS versions older than 15, but versions after this do not auto-summary.  On older routers, disable auto summary under the EIGRP AS with command: no auto-summary. 

To use a summary address, under the EIGRP AS, use command: ip summary-address eigrp <AS> <summary address> <subnet mask> <AD>. 

##### OSPF Summarization 

As OSPF is a link-state protocol, summarization can only be performed on ABRs (Area Border Routers) and ASBRs (Autonomous System Border Routers). 

On an ABR, use command (under OSPF process): area <number> range <summary address> <subnet mask> [cost <cost value>]. 

The area number must be the area that has the network being specified, and the summary will then be advertised into all other areas by the ABR. 

On an ASBR, use command (under OSPF process): summary-address <summary address> <subnet mask>. 

##### BGP Summarization

BGP is also capable of auto-summary and simply needs the command: auto-summary placed under the appropriate BGP AS. For more controlled summarization, use the command: aggregate-address <summary address> <subnet mask> [summary-only].
