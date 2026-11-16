---
title: SPAN - ERSPAN - Configuration
tags:
  - span
status: draft
version: 0.0.1
---

configure terminal  
monitor session 1 type erspan-source  
description SOURCE-PC-D-TRAFFIC  
source interface GigabitEthernet 1/0/4 rx  
filter vlan 34  
no shutdown  
destination  
ip address 192.0.2.100  
erspan-id 2  
origin ip address 198.51.100.4  
exit  
erspan ttl 32  
end
