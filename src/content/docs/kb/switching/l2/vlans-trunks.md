---
title: "VLANs and trunks"
description: "Access ports, trunk ports and the native VLAN."
tags: [switching]
verified: "2026-10"
sample: true
---

An access port carries one VLAN untagged. A trunk carries several, tagged with 802.1Q, plus one
untagged native VLAN. Loops between switches are handled by [spanning tree](../stp-variants/).
