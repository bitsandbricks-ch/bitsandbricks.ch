---
title: DTP
tags:
  - dtp
  - switching
status: draft
version: 0.0.1
---

Dynamic trunk ports are established by the switch port sending Dynamic Trunking Protocol

(DTP) packets to negotiate whether the other end can be a trunk port. 

If both ports can successfully negotiate an agreement, the port will become a trunk switch port. DTP advertises itself every 30 seconds to neighbors so that they are kept aware of its status. DTP requires that the VTP domain match between the two switches.
There are three modes to use in setting a switch port to trunk:

Trunk: This mode statically places the switch port as a trunk and advertises DTP

packets to the other end to establish a dynamic trunk. 

Dynamic desirable: In this mode, the switch port acts as an access port, but it listens
for and advertises DTP packets to the other end to establish a dynamic trunk. If it is

successful in negotiation, the port becomes a trunk port. 

Dynamic auto: In this mode, the switch port acts as an access port, but it listens for
DTP packets. It responds to DTP packets and, upon successful negotiation, the port

becomes a trunk port.

A static trunk port attempts to establish and negotiate a trunk port with a neighbor by

default. However, the interface configuration command switchport nonegotiate prevents

that port from forming a trunk port with a dynamic desirable or dynamic auto switch port

|   |
|---|
|Note: As a best practice, configure both ends of a link as a fixed port type (using switchport mode access or switchport mode trunk) to remove any uncertainty about the port's operations.|
