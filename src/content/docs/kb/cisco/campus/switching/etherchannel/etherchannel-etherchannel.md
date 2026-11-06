---
title: EtherChannel - EtherChannel
tags:
  - etherchannel
status: draft
version: 0.0.1
---

Fortunately, the physical links can be aggregated into a logical link called an EtherChannel bundle. The industry-based term for an EtherChannel bundle is EtherChannel (for short), or port channel, which is defined in the IEEE 802.3AD link aggregation specification. The physical interfaces that are used to assemble the logical EtherChannel are called member interfaces. 

STP operates on a logical link and not on a physical link. The logical link would then have the bandwidth of any active member interfaces, and it would be load balanced across all the links. EtherChannels can be used for either Layer 2 (access or trunk) or Layer 3 (routed) forwarding.
A primary advantage of using port channels is a reduction in topology changes when a member link line protocol goes up or down as long as one member remains active

A switch can successfully form an EtherChannel by statically setting them to an on state or by using a dynamic link aggregation protocol to detect connectivity between devices. 

A significant downfall of statically setting an EtherChannel to an on state is that there is no health integrity check. If the physical medium degrades and keeps the line protocol in an up state, the port channel will reflect that link as viable for transferring data, which may not be accurate and would result in sporadic packet loss.
