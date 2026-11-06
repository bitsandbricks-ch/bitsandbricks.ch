---
title: QOS IP Precedence and DSCP Compared
tags:
  - qos
status: draft
version: 0.0.1
---

The IP header is defined in RFC 791, including a 1-byte field called the Type of Service (ToS) byte. The ToS byte was intended to be used as a field to mark a packet for treatment with QoS tools. 

The ToS byte itself was further subdivided, with the high-order 3 bits defined as the IP Precedence (IPP) field. The complete list of values from the ToS byte’s original IPP 3-bit field, and the corresponding names, is provided below

| Name | Decimal Value | Binary Value |
| -- | - | - |
| Routine | Precedence 0 | 000 |
| Priority | Precedence 1 | 001 |
| Immediate | Precedence 2 | 010 |
| Flash | Precedence 3 | 011 |
| Flash Override | Precedence 4 | 100 |
| Critic/Critical | Precedence 5 | 101 |
| Internetwork Control | Precedence 6 | 110 |
| Network Control | Precedence 7 | 111 |
: *IP Precedence Values and Name*

A series of RFCs collectively called Differentiated Services (DiffServ) came along later. DiffServ needed more than 3 bits to mark packets, so DiffServ standardized a redefinition of the ToS byte. The ToS byte itself was renamed the Differentiated Services (DS) field, and IPP was replaced with a 6-bit field (high-order bits 0–5) called the Differentiated Services Code Point (DSCP) field. Later, RFC 3168 defined the low-order 2 bits of the DS field for use with the QoS Explicit Congestion Notification (ECN) feature.

C&M tools often mark DSCP or IPP because the IP packet remains intact as it is for- warded throughout an IP network. The other possible marking fields reside inside Layer 2 headers, which means that the headers are discarded when forwarded by a Layer 3 pro- cess. Thus, the latter cannot be used to carry QoS markings beyond the current hop
