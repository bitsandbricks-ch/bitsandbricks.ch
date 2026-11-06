---
title: uRPF - Unicast Reverse Path Forwarding (uRPF)
tags:
  - routing
status: draft
version: 0.0.1
---

Normally when your router receives unicast IP packets, it only cares about one thing:
- _What is the destination IP address of this IP packet so I can forward it?_

If the IP packet has to be routed it will check the routing table for the destination IP address, select the correct interface and it will be forwarded. Your router really doesn’t care about source IP addresses as it’s not important for forwarding decisions.

Because the router doesn’t check the source IP address it is possible for attackers to spoof the source IP address and send packets that normally might have been dropped by the firewall or an access-list.

uRPF is a security feature that prevents these spoofing attacks. Whenever your router receives an IP packet it will check if it has a matching entry in the routing table for the source IP address. If it doesn’t match, the packet will be discarded. uRPF has two modes:

- Strict mode
- Loose mode

Strict mode means that that router will perform two checks for all incoming packets on a certain interface:

- Do I have a matching entry for the source in the routing table?
- Do I use the same interface to reach this source as where I received this packet?

Loose mode means that the router will perform only a single check when it receives an IP packet on an interface:

- Do I have a matching entry for the source in the routing table?
