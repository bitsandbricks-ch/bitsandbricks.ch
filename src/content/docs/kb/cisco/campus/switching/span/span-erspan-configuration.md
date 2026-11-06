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
ip address 10.123.1.100  
erspan-id 2  
origin ip address 10.34.1.4  
exit  
erspan ttl 32  
end
