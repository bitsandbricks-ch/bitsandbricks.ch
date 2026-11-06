---
title: Switching - Internal Processing
tags:
  - general
status: draft
version: 0.0.1
---

Store-and-forward: The switch fully receives all bits in the frame (store) before forwarding
the frame (forward). This allows the switch to check the frame check
sequence (FCS) before forwarding the frame, thus ensuring that
errored frames are not forwarded.

Cut-through:  The switch performs the address table lookup as soon as the Destination Address field in the header is received. The first bits in the frame can be sent out the outbound port before the final bits in the incoming frame are received. This does not allow the switch to discard frames that fail the FCS check, but the forwarding action is faster, resulting in lower latency.

Fragment-free: This performs like cut-through switching, but the switch waits for 64 bytes to be received before forwarding the first bytes of the outgoing frame. According to Ethernet specifications, collisions should be detected during the first 64 bytes of the frame, so frames that are in error because of a collision will not be forwarded.
