---
title: EtherChannel - PAgp - PAgp Protocol
tags:
  - etherchannel
  - pagp
status: draft
version: 0.0.1
---

PAgP advertises messages with the multicast MAC address 0100:0CCC:CCCC and the protocol code 0x0104. PAgP can operate in two modes:

Auto: In this PAgP mode, the interface does not initiate an EtherChannel to be
established and does not transmit PAgP packets out of it. If a PAgP packet is
received from the remote switch, this interface responds and then can establish a

PAgP adjacency. If both devices are PAgP auto, a PAgP adjacency does not form.

Desirable: In this PAgP mode, an interface tries to establish an EtherChannel and
transmit PAgP packets out of it. Active PAgP interfaces can establish a PAgP adjacency
only if the remote interface is configured to auto or desirable.
