---
title: EtherChannel - EtherChannel Configuration
tags:
  - etherchannel
status: draft
version: 0.0.1
---

### General Configuration

###### Configure a static EtherChannel (Interface Level)

|   |
|---|
|channel-group <etherchannel-id> mode on|

###### Configure a LACP EtherChannel (Interface Level)

|   |
|---|
|channel-group <etherchannel-id> mode {active \| passive}|

###### Configure a PAgP EtherChannel (Interface Level)

|   |
|---|
|channel-group <etherchannel-id> mode {auto \| desirable} [non-silent]|

The non-silent keyword is recommended when connecting PAgP-compliant

switches together; the non-silent option results in a link being established more quickly than

if this keyword were not used

### Advanced LACP Configuration

###### Configure max member interfaces 

|   |
|---|
|lacp max-bundle <max-links>|

An EtherChannel can be configured to have a specific maximum number of member

interfaces in a port channel. This may be done to ensure that the active member interface count proceeds with powers of two (for example, 2, 4, 8) to accommodate load-balancing hashes

###### Configure min member interfaces 

|   |
|---|
|lacp max-bundle <min-links>|

An EtherChannel interface becomes active and up when only one member interface

successfully forms an adjacency with a remote device. In some design scenarios using

LACP, a minimum number of adjacencies is required before a port-channel interface

becomes active

###### Configure lacp system priority 

|   |
|---|
|lacp system-priority <priority>|

The LACP system priority identifies which switch is the master switch for a port channel.

The master switch on a port channel is responsible for choosing which member interfaces are active in a port channel when there are more member interfaces than the maximum number of member interfaces associated with a port-channel interface. The switch with the lower  system priority is preferred

###### Configure lacp port priority 

|   |
|---|
|lacp port-priority <priority>|

LACP interface priority enables the master switch to choose which member interfaces are

active in a port channel when there are more member interfaces than the maximum number

of member interfaces for a port channel. A port with a lower port priority is preferred

###### Configure system load balancing hash 

|   |
|---|
|port-channel load-balance <hash>|

Traffic that flows across a port-channel interface is not forwarded out member links on

a round-robin basis per packet. Instead, a hash is calculated, and packets are consistently

forwarded across a link based on that hash, which runs on the various packet header fields.

he hash option has the following keyword choices:

- dst-ip: Destination IP address
- dst-mac: Destination MAC address
- dst-mixed-ip-port: Destination IP address and destination TCP/UDP port
- dst-port: Destination TCP/UDP port
- src-dst-ip: Source and destination IP addresses
- src-dest-ip-only: Source and destination IP addresses only
- src-dst-mac: Source and destination MAC addresses
- src-dst-mixed-ip-port: Source and destination IP addresses and source and destination TCP/UDP ports
- src-dst-port: Source and destination TCP/UDP ports only
- src-ip: Source IP address
- src-mac: Source MAC address
- src-mixed-ip-port: Source IP address and source TCP/UDP port
- src-port: Source TCP/UDP port
