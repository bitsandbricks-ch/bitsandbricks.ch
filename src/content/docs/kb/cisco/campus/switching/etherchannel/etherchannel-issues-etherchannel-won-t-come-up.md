---
title: EtherChannel - Issues - EtherChannel won’t come up
tags:
  - etherchannel
status: draft
version: 0.0.1
---

It is important to remember that a port channel is a logical interface, so all the member interfaces must have the same characteristics. If they do not, problems will occur.

As a general rule, when configuring port channels on a switch, place each member interface in the appropriate switch port type (Layer 2 or Layer 3) and then associate the interfaces to a port channel. All other port-channel configuration is done via the port-channel interface.

The following configuration settings must match on the member interfaces:

- Port type: All ports must be Layer 2 switch ports or a Layer 3 routed port.
- Port mode: All Ports must be access ports or trunk ports. They cannot be mixed.
- Native VLAN
- Allowed VLAN
- Speed: All member interfaces must be the same speed.
- Duplex: The duplex must be the same for all member interfaces.
- MTU: All Layer 3 member interfaces must have the same MTU configured.
- Load interval
- Storm control.

In addition to paying attention to the configuration settings listed above, check the following when troubleshooting the establishment of an EtherChannel bundle:

- Ensure that a member link is between only two devices.
- Ensure that the member ports are all active.
- Ensure that both end links are statically set to on and that either LACP is enabled with at least one side set to active or PAgP is enabled with at least one side set to desirable.
- Ensure that all member interface ports are consistently configured (except for LACP port priority).
- Verify the LACP or PAgP packet transmission and receipt on both devices.
