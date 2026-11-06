---
title: Security - SIFS - IPv6 - Destination Guard
tags:
  - ipv6
status: draft
version: 0.0.1
---

The IPv6 Destination Guard feature works with IPv6 neighbor discovery to ensure that the device performs address resolution only for those addresses that are known to be active on the link. It relies on the address glean functionality to populate all destinations active on the link into the binding table and then blocks resolutions before they happen when the destination is not found in the binding table.
