---
title: Packet Forwarding
tags:
  - general
status: draft
version: 0.0.1
---

# L3 Forwarding

There are two main methods for layer 3 forwarding:
* Forwarding to devices in the same subnet
* Forwarding to devices on a different subnet

Packet Routing

The device checks it’s local routing table to identify it’s nexthop, which can be learned in a few ways:

* Stating routing entry
* Default gateway entry, essentially a static route
* Routing Protocol like OSPV or similar

# Forwarding Architectures

_When a rote processor is equipped with a forwarding engine so that it can make all the packet switching decisions, this is known as centralised forwarding architecture. If line cards are equipped with forwarding engines without intervention of the route processor this is known as distributed forwarding architecture_

# Process Switching

Process Switching, also referred to as Software Switching or slow path, is a switching mechanism in which the CPU on a router is in charge of packet switching

The following type of packets are process switched:
* Packets sources or destined to the router
* Packets that are too complex for hardware to hande, Example: IP packets with IP options
* Packets that require extra information that is not currently know Example ARP

Packets that can’t be CEF switched are called punted

### Ternary Content Addressable Memory (TCAM)

TCAM provides more flexibility in searching than a CAM, which is solely in binary.

A TCAM search provides three results:

* 0 for true
* 1 for false
* X for do not care, which is a ternary combination

### SDM Templates

When a section of a hardware resource is full, all processing overflow is sent to the CPU, which can heavily impact the performance for the switch/router.

Those allocation rations can be modified with Switching Database Manager (SDM) templates

## Default Values

## Commands

<!--H6 not demoted to H7. -->

###### Modify the SDM template

```
sdm prefer {vlan | advanced}
```

## 

## Known Issues
## Key Topics in the Book

<table>
  <tr>
   <td>Element
   </td>
   <td>Description
   </td>
   <td>E-Book Page
   </td>
  </tr>
  <tr>
   <td>Paragraph
   </td>
   <td>Collision domain
   </td>
   <td>5
   </td>
  </tr>
  <tr>
   <td>Paragraph
   </td>
   <td>Virtual LANs (VLANs)
   </td>
   <td>7
   </td>
  </tr>
  <tr>
   <td>Section 
   </td>
   <td>Access ports
   </td>
   <td>11
   </td>
  </tr>
  <tr>
   <td>Section 
   </td>
   <td>Trunk ports
   </td>
   <td>12
   </td>
  </tr>
  <tr>
   <td>Paragraph
   </td>
   <td>Content addressable memory
   </td>
   <td>16
   </td>
  </tr>
  <tr>
   <td>Paragraph
   </td>
   <td>Address resolution protocol (ARP)
   </td>
   <td>19
   </td>
  </tr>
  <tr>
   <td>Paragraph
   </td>
   <td> IP address assignment
   </td>
   <td>21
   </td>
  </tr>
  <tr>
   <td>Section
   </td>
   <td>Process switching
   </td>
   <td>25
   </td>
  </tr>
  <tr>
   <td>Section
   </td>
   <td> Cisco Express Forwarding (CEF)
   </td>
   <td>26
   </td>
  </tr>
  <tr>
   <td>Section
   </td>
   <td>Ternary content addressable memory
   </td>
   <td>26
   </td>
  </tr>
  <tr>
   <td>Section
   </td>
   <td>Software CEF
   </td>
   <td>28
   </td>
  </tr>
  <tr>
   <td>Section
   </td>
   <td>SDM templates
   </td>
   <td>30
   </td>
  </tr>
</table>
