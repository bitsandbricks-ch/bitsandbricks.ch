---
title: Multicast IGMPv2
tags:
  - multicast
  - version-2
status: draft
version: 0.0.1
---

IGMPv2 has four fields, which are defined as follows:

#todo/cleanup 
### Type
An 8-bit field that is one of four message types defined by IGMPv2: 
#### Membership Query (Type code = 0x11)
Used by multicast routers to discover the presence of group members on a subnet. A General Membership Query message sets the Group Address field to 0.0.0.0. A Group-Specific Query sets the Group Address field to the address of the group being queried. It is sent by a router after it receives the IGMPv2 Leave Group message from a host. 
#### Version 1 Membership Report (Type code = 0x12)
Used by IGMPv2 hosts for backward compatibility with IGMPv1.
#### Version 2 Membership Report (Type Code = 0x16)
Sent by a group member to inform the router that at least one group member is present on the subnet. 
#### Leave Group (Type code = 0x17)
Sent by a group member if it was the last member to send a Membership Report to inform the router that it is leaving the group.
### Maximum Response Time
8-bit field included only in Query messages. The units are 1/10 of a second, with 100 (10 seconds) being the default. The values range from 1 to 255 (0.1 to 25.5 seconds). 
### Checksum: 
Carries the 16-bit checksum computed by the source. The IGMP check- sum is computed over the entire IP payload, not just over the first 8 octets, even though IGMPv2 messages are only 8 bytes in length. 
### Group Address
Set to 0.0.0.0 in General Query messages and to the group address in Group-Specific messages. Membership Report messages carry the address of the group being reported in this field; Leave Group messages carry the address of the group being left in this field.

IGMPv2 supports complete backward compatibility with IGMPv1. The IGMPv2 Type codes 0x11 and 0x12 match the type codes for IGMPv1 for the Membership Query and Membership Report messages. This enables IGMPv2 hosts and routers to recognize IGMPv1 messages when IGMPv1 hosts or routers are on the network.
