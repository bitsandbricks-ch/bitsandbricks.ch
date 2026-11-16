---
title: BGP Neighbor Routes
tags:
  - bgp
  - neighbor
status: draft
version: 0.0.1
---

## Advertised Routes

`show ip bgp neighbor [neighbor-id] advertised-routes`
## Received Routes

`show ip bgp neighbor [neighbor-id] received-routes`

For the received-routes option to work, the router on which the command is used must have the `neighbor neighbor-id soft-reconfiguration inbound` BGP subcommand configured for the other neighbor.
