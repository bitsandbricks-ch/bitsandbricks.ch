---
title: BGP Messages
tags:
  - bgp
status: draft
version: 0.0.1
---

#### Open
Used to establish a neighbor relationship and exchange basic parameters. 
#### Keepalive
Used to maintain the neighbor relationship, with nonreceipt of a keepalive message within the negotiated Hold timer causing BGP to bring down the neighbor connection. (The timers can be configured with the bgp timers keepalive holdtime subcommand or the neighbor [ip-address | peer-group- name] timers keepalive holdtime BGP subcommand.) 
#### Update
Used to exchange routing information, as covered more fully in the next section. 
#### Notification
Used when BGP errors occur; causes a reset to the neighbor relationship when sent.
