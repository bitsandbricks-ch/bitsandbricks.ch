---
title: MST Configuration
tags:
  - stp
  - mst
status: draft
version: 0.0.1
---

###### Define MST as the spanning tree protocol

`spanning-tree mode mst`
###### Define the MST instance priority

`spanning-tree mst <instance-number> priority <priority>`

The priority is a value between 0 and 61,440, in increments of 4096.

`spanning-tree mst <instance-number> root {primary \| secondary}[diameter diameter]`

The primary keyword sets the priority to 24,576, and the secondary keyword sets the priority to 28,67

###### MST configuration submode

`spanning-tree mst configuration`

###### Associate VLANs to an MST instance (MST Config Mode)

`instance <instance-number> vlan <vlan-id>`

###### Specify the MST version number (MST Config Mode)

`revision version`

The MST version number must match for all switches in the same MST region.

###### Define MST region name (MST Config Mode)

`name mst-region-name <name>`

MST regions are recognized by switches that share a common name

###### Modify MST port cost

`spanning-tree mst <instance-number> cost <cost>`

###### Modify MST port priority

`spanning-tree mst <instance-number> port-priority <priority>`
