---
title: Multicast IP Addresses to MAC Mapping
tags:
  - multicast
status: draft
version: 0.0.1
---

Assigning a Layer 3 multicast address to a multicast group (application) automatically generates a Layer 2 multicast address. The MAC address is formed using an IEEE- registered OUI of 01005E, then a binary 0, and then the last 23 bits of the multicast IP address. The method is identical for Ethernet and Fiber Distributed Data Interface (FDDI).

1. Convert the IP address to binary. The first 4 bits are always 1110 for any multicast IP address. 
2. Replace the first 4 bits 1110 of the IP address with the 6 hex digits 01-00-5E as multicast OUI
3. Replace the next 5 bits of the binary IP address with one binary 0. 
4. Copy the last 23 bits of the binary IP in the last 23-bit space of the multicast MAC address. 
5. Convert the last 24 bits of the multicast MAC address from binary to 6 hex digits. 
6. Combine the first 6 hex digits 01-00-5E with the last 6 hexadecimal digits
