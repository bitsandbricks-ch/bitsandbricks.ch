---
title: BGP - Neighbors
tags:
  - bgp
status: draft
version: 0.0.1
---

## Checks before becoming Neighbors

1. The router must receive a TCP connection request with a source address that the router finds in a BGP neighbor command. 
2. A router’s ASN (on the router bgp asn command) must match the neighboring rout- er’s reference to that ASN with its neighbor remote-as asn command. (This require- ment is not true of confederation configurations.) 
3. The BGP RIDs of the two routers must not be the same. 4. If configured, MD5 authentication must pass.

BGP uses a keepalive timer to define how often that router sends BGP keepalive mes- sages, and a Hold timer to define how long a router will wait without receiving a keep- alive message before resetting a neighbor connection. The Open message includes each router’s stated keepalive timer. If they do not match, each router uses the lower of the values for each of the two timers, respectively. Mismatched settings do not prevent the routers from becoming neighbor
