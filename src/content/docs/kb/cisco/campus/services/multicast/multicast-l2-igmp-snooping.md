---
title: Multicast L2 IGMP Snooping
tags:
  - multicast
status: draft
version: 0.0.1
---

IGMP snooping can be used for a multivendor switched network to control distribution of multicast traffic at Layer 2. IGMP snooping requires the switch software to eavesdrop on the IGMP conversation between multicast hosts and the router. The switch examines IGMP messages and learns the location of multicast routers and group members.

The following three steps describe the general process of IGMP snooping. Later, these steps are explained in detail. 
1. To detect whether multiple routers are connected to the same subnet, Cisco switches listen to the following routing protocol messages to determine on which ports rout- ers are connected: 
	- IGMP General Query message with GDA 01-00-5e-00-00-01
	- OSPF messages with GDA 01-00-5e-00-00-05 or 01-00-5e-00-00-06 
	- Protocol Independent Multicast (PIM) version 1 and Hot Standby Routing Proto- col (HSRP) Hello messages with GDA 01-00-5e-00-00-02 
	- PIMv2 Hello messages with GDA 01-00-5e-00-00-0d 
	- Distance Vector Multicast Routing Protocol (DVMRP) Probe messages with GDA 01-00-5e-00-00-04 
	As soon as the switch detects router ports in a VLAN, they are added to the port list of all GDAs in that VLAN. 
2. When the switch receives an IGMP Report on a port, its CPU looks at the GDA, creates an entry in the CAM table for the GDA, and adds the port to the entry. The router port is also added to the entry. The group traffic is now forwarded on this port and the router port. If other hosts send their IGMP Reports, the switch adds their ports to the group entry in the CAM table and forwards the group traffic on these ports. 
3. Similarly, when the switch receives an IGMP Leave message on a port, its CPU looks at the GDA, removes the port from the group entry in the CAM table, and does not forward the group traffic on the port. The switch checks whether this is the last nonrouter port for the GDA. If it is not the last nonrouter port for the GDA, which means that there is at least one host in the VLAN that wants the group traffic, the switch discards the Leave message; otherwise, it sends the Leave message to the router. 

Thus, IGMP snooping helps switches send group traffic to only those hosts that want it and helps to avoid wasted bandwidth.
