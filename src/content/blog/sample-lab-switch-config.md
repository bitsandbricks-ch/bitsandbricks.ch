---
title: "Sample post: templating a lab switch config"
summary: Sample post. Shows how a post looks, with headings, a config block and a link into the kb.
date: 2026-11-02
facility: homelab
tags: [homelab, ansible, switching]
sample: true
---

This is a sample post so you can see the layout. Replace it with a real one, or delete the file.

## Why a template

A post is one Markdown file in `src/content/blog/`. The date, tags and the facility in the
syslog-style header come from the frontmatter at the top of the file.

```
interface GigabitEthernet1/0/1
 description uplink-core
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

## Linking into the kb

Posts can link to kb notes, like [VLANs and trunks](/kb/switching/l2/vlans-trunks/), with a
normal Markdown link.

> Quotes and short notes render as a callout.
