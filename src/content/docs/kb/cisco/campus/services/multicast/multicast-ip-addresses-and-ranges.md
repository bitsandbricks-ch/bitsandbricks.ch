---
title: Multicast IP Addresses and Ranges
tags:
  - multicast
status: draft
version: 0.0.1
---

Multicast applications always use a multicast IP address. This multicast address represents the multicast application and is referred to as a multicast group. Unlike a unicast IP address, which uniquely identifies a single IP host, a multicast address used as a destination address on an IP packet signifies that the packet is carrying traffic for a specific multicast application. 
## Summary of Multicast Address Ranges

| Multicast Address Range | Usage |
| -- | -- |
| 224.0.0.0 to 239.255.255.255 | This range represents the entire IPv4 multicast address space. It is reserved for multicast applications. |
| 224.0.0.0 to 224.0.0.255 | This range is part of the permanent groups. Addresses from this range are assigned by IANA for network protocols on a local segment. Routers do not forward packets with destination addresses used from this range. |
| 224.0.1.0 to 224.0.1.255 | This range is also part of the permanent groups. Addresses from this range are assigned by IANA for the network protocols that are forwarded in the entire network. Routers forward packets with destination addresses used from this range. |
| 232.0.0.0 to 232.255.255.255 | This range is used for SSM applications. |
| 233.0.0.0 to 233.255.255.255 | This range is called the GLOP addressing. It is used for automatically allocating 256 multicast addresses to any enterprise that owns a registered ASN. |
| 239.0.0.0 to 239.255.255.255 | This range is used for private multicast domains. These addresses are called administratively scoped addresses. |
| Remaining ranges of addresses in the multicast address space | Addresses from these ranges are called transient groups. Any enterprise can allocate a multicast address from the transient groups for a global multicast application and should release it when the application is no longer in use. |

## Multicast Address Range and Structure

The Internet Assigned Numbers Authority (IANA) has assigned class D IP addresses to multicast applications. The first 4 bits of the first octet for a class D address are always 1110. IP multicast addresses range from 224.0.0.0 through 239.255.255.255.

### Well-Known Multicast Addresses
IANA controls the assignment of IP multicast addresses. To preserve multicast addresses, IANA is reluctant to assign individual IP multicast addresses to new applications without a good technical justification.  However, IANA has assigned individual IP multicast addresses to popular network protocols.

IANA has assigned several ranges of multicast IP addresses for specific types of reasons. Those types are as follows: 
- Permanent multicast groups, in the range 224.0.0.0–224.0.1.255 
- Addresses used with Source-Specific Multicast (SSM), in the range 232.0.0.0– 232.255.255.255
- GLOP addressing, in the range 233.0.0.0–233.255.255.255 
- Private multicast addresses, in the range 239.0.0.0–239.255.255.255
#### Multicast Addresses for Permanent Groups
IANA has reserved two ranges of permanent multicast IP addresses. The main distinction between these two ranges of addresses is that the first range is used for packets that should not be forwarded by routers
- The range of addresses used for local (not routed) purposes is 224.0.0.0 through 224.0.0.255. These addresses should be somewhat familiar from the routing protocol.
- The range of permanent group addresses used when the packets should be routed is 224.0.1.0 through 224.0.1.255. This range includes 224.0.1.39 and 224.0.1.40, which are used by Cisco-proprietary Auto-Rendezvous Point (Auto-RP) protocols 

| Address | Usage |
| ---- | ----- |
| 224.0.0.1 | All multicast hosts |
| 224.0.0.2 | All multicast routers |
| 224.0.0.4 | DVMRP routers |
| 224.0.0.5 | All OSPF routers |
| 224.0.0.6 | OSPF designated routers |
| 224.0.0.9 | RIPv2 routers |
| 224.0.0.10 | EIGRP routers |
| 224.0.0.13 | PIM routers |
| 224.0.0.22 | IGMPv3 |
| 224.0.0.25 | RGMP |
| 224.0.1.39 | Cisco-RP-Announce |
| 224.0.1.40 | Cisco-RP-Discovery |
: *Some Well-Known Reserved Multicast Addresses*
#### Multicast Addresses for Source-Specific Multicast Applications and Protocols
IANA has allocated the range 232.0.0.0 through 232.255.255.255 for SSM applications and protocols. The purpose of these applications is to allow a host to select a source for the multicast group. SSM makes multicast routing efficient, allows a host to select a better-quality source, and helps network administrators minimize multicast denial of service (DoS) attacks.
#### Multicast Addresses for GLOP Addressing
IANA has reserved the range 233.0.0.0 through 233.255.255.255 (RFC 3180), called GLOP addressing, on an experimental basis. It can be used by anyone who owns a registered autonomous system number (ASN) to create 256 global multicast addresses that can be owned and used by the entity. IANA reserves addresses to ensure global uniqueness of addresses; for similar reasons, each autonomous system should be using an assigned unique ASN.

By using a value of 233 for the first octet, and by using the ASN for the second and third octets, a single autonomous system can create globally unique multicast addresses as defined in the GLOP addressing RFC

#### Multicast Addresses for Private Multicast Domains
IANA has assigned the range 239.0.0.0 through 239.255.255.255 (RFC 2365) for use in private multicast domains, much like the IP unicast ranges defined in RFC 1918, namely, 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. 

IANA will not assign these administratively scoped multicast addresses to any other protocol or application. Network administrators are free to use multicast addresses in this range; however, they must configure their multicast routers to ensure that multicast traffic in this address range does not leave their multicast domain boundaries.
