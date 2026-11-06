---
title: OSPF State Down
tags:
  - ospf
status: draft
version: 0.0.1
---

As soon as I configure OSPF on R1, it will send hello packets. R1 has no clue about other OSPF routers at this moment, so it’s in the down state. The hello packet will be sent to the multicast address 224.0.0.5.
