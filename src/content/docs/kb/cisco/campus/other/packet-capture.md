---
title: Packet Capture
tags:
  - other
status: draft
version: 0.0.1
---

# Normal / Interface Level

```
monitor capture CAP interface xy both
monitor capture CAP match any

monitor capture CAP buffer circular
OR
monitor capture CAP file location flash:CAP.pcap

monitor capture CAP start 
monitor capture CAP stop
show monitor capture CAP buffer brief
```

# CPU

```
debug platform software fed switch active inject packet-capture start
debug platform software fed switch active inject packet-capture stop
show platform software fed switch active inject packet-capture brief
show platform software fed switch active packet-capture brief
```
[https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-xe-gibraltar-16121/216746-configure-punt-inject-fed-packet-capture.html](https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-xe-gibraltar-16121/216746-configure-punt-inject-fed-packet-capture.html)

```
monitor capture cpuCap control-plane in match any file location flash:cpuCap.pcap  monitor capture cpuCap start
monitor capture cpuCap stop
```
