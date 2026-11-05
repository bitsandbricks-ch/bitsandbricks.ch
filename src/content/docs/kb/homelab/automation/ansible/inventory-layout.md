---
title: "Ansible inventory layout for network gear"
description: "Groups and variables for switches and routers."
tags: [ansible, automation]
verified: "2026-10"
sample: true
---

```
inventory/
  hosts.yml
  group_vars/
    switches.yml
    routers.yml
```

Variables for trunks come from [VLANs and trunks](/kb/switching/l2/vlans-trunks/), and BGP
neighbours from [BGP basics](/kb/routing/bgp/bgp-basics/).
