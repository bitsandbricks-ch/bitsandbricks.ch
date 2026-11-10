---
title: EIGRP Configuration
tags:
  - eigrp
status: draft
version: 0.0.1
---

! Routing process  
R1(config)# router eigrp 100  
! Without mask class mask is used  
R1(config-router)# network 172.16.1.0  
R1(config-router)# network 172.16.1.0 0.0.0.255  
R1(config-router)# eigrp router-id 1.1.1.1
