---
title: OSPF Tagging BGP
tags:
  - bgp
  - filtering
  - ospf
status: draft
version: 0.0.1
---

There does exist, however, one way of performing such redistribution. RFC 1401 details OSPF to BGP interactions. One such interaction includes ways of encoding BGP routing information in OSPF to be used when redistributing OSPF routes into BGP

This method takes advantage of the OSPF Tag value that is attached to all OSPF external prefixes. Section 4 of RFC 1403 goes into details about how this interaction works. Section 4.4.6 is of special note. 

The OSPF tag field is a 32-bit number like an IP address. Unlike an IP address, it is expressed fully in decimal and not dotted decimal (1 vs 0.0.0.1). Section 4.4.6 details values for the first four bits of the OSPF tag. If these bits are set to “1110”, when the OSPF route is redistributed into BGP, the redistributing router will ignore the prefix. In other words, when encountering an OSPF prefix with a tag value with “1110” as the four most significant bits, it will assume that this prefix should not be redistributed into BGP. 
Specifically, the RFC mentions that the BGP router should assume the prefix will be directly injected into BGP. The result is, the prefix is redistributed into OSPF but not into BGP. The task is solved using this feature. 

The route-map TST should be modified to set the OSPF tag value to a value that sets the first four significant bits to “1110”. Doing so requires some math. Because the OSPF tag value itself is a 32-bit number, the smallest possible value is `11100000 00000000 00000000 00000000`. Written as a dotted decimal the number translates to `224.0.0.0` but as a decimal number it’s equal to `3,758,096,384`. This is the tag value that should be used in the route-map.
>[!note]
>In some IOS versions, it is possible to set the tag value as a dotted decimal number. For example, in the above, the set command could be entered as set tag `224.0.0.0`. The router will convert the dotted decimal to decimal `3,758,096,384`
