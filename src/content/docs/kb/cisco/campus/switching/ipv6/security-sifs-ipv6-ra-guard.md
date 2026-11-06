---
title: Security - SIFS - IPv6 - RA Guard
tags:
  - ipv6
status: draft
version: 0.0.1
---

Hosts automatically select a router advertisement and they don’t care where it came from. This is how it was meant to be but it does introduce a security risk since any device can send router advertisements and your hosts will happily accept it. An attacker can send rogue router advertisements to redirect the traffic, or you can send so many RAs that it causes a DOS since your hosts will be too busy configuring their IPv6 prefixes.

The IPv6 RA guard feature can filter router advertisements and runs on switches. This can be as simple as "don’t allow RAs on this interface" or complex with policies where router advertisements are only permitted when it matches certain criteria.
