---
title: OSPF Packet Detail
tags:
  - ospf
status: draft
version: 0.0.1
---

If we use `debug ip ospf packet` we can look at the OSPF packet on our router. Let’s look at the different fields we have:

- V:2 stands for OSPF version 2. If you are running IPv6, you’ll version 3.
- T:1 stands for OSPF packet number 1, which is a hello packet. I’m going to show you the different packets in a bit.
- L:48 is the packet length in bytes. This hello packet seems to be 48 bytes.
- RID 1.1.1.1 is the Router ID.
- AID is the area ID in dotted decimal. You can write the area in decimal (area 0) or dotted decimal (area 0.0.0.0).
- CHK 4D40 is the checksum of this OSPF packet, so we can check if the packet is corrupt or not.
- AUT:0 is the authentication type. You have three options:
    - 0 = no authentication
    - 1 = clear text
    - 2 = MD5
- AUK: If you enable authentication, you’ll see some information here.
