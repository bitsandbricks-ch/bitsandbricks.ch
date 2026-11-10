---
title: BFD
tags:
  - routing
status: draft
version: 0.0.1
---

#certifications/cisco/ccie/enterprise/network-infrastructure/routing-concepts/bfd    

BFD is a protocol that is designed to detect link failure for any kind of network medium and report this failure to the routing protocol it’s configured to work with.  The routing protocol upon learning of a link failure from BFD, will tear down it’s neighbour relationships associated with the failed link.  BFD is a much faster way of doing this, when compared to the mechanisms built into each routing protocol. 

CEF and IP routing must be enabled before BFD can be deployed. The routing protocol being used in conjunction with BFD must be configured for fast-convergence before deploying BFD. 

BFD has 2 modes of main operation; Asynchronous and Demand mode. 

Asynchronous 
- Periodically sends Hello packets 
- If a number of packets are not received, the link is considered down 

Demand 
- No Hello packets are exchanged after the session is established 
- Assumes the endpoints have another way to verify connectivity 

Echo mode is a default mode of operation in Asynchronous mode. 
Multiplier in the config, specifies the minimum number of consecutive packets that be missed before a link is declared as down. 

Config: 

##### Interface 
```
bfd interval <time in ms> mix-rx <time in ms> multiplier <number of missed packets> 
```

##### OSPF 
```
router ospf <process id> area <number> 
ip ospf bfd
```
##### EIGRP 
```
router eigrp <as> 
network 0.0.0.0 
bfd all-interfaces 
Or
bfd interface <interface id>
```
##### BGP 
```
router bgp <as>
neighbor <neighbor IP> remote-as <as> 
neighbor <neighbor IP> fall-over bfd
```
