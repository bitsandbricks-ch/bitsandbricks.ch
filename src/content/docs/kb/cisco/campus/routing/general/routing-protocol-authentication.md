---
title: Routing Protocol Authentication
---

#certifications/cisco/ccie/enterprise/network-infrastructure/routing-concepts/authentication 

There are two methods of securing routing protocol communication.  One method is to use the mechanism of authentication built into a few of the routing protocols, such as OSPF or BGP.  Another method is to use a key-chain where you create a key for the purpose of authentication, then reference that key-chain/key within the RIP or EIGRP routing protocol configuration. 

##### OSPF 
```

interface <interface id>
ip ospf authentication [message-digest]
ip ospf authentication-key <key>
Or
ip ospf message-digest-key <key id> md5 <key>
```
###### Area authentication: 
```
router ospf <process id>
area <area id> authentication [message-digest] 

interface <interface id> 
ip ospf authentication-key <key>  
Or
ip ospf message-digest-key <key id> md5 <key>
```
##### BGP 
```
router bgp <AS>
neighbor <ip address | peer group> password <password>
```
##### Key-Chain Creation 
```
key chain <key chain name> 
key <key id>
key-string <secret key string> 
accept-lifetime <start time> [infinite | duration (seconds) | end time] <duration | end time>
send-lifetime <start time> [infinite | duration (seconds) | end time] <duration | end time> 
```
Where “accept-lifetime” is configuring receipt of keys and “send-lifetime” is configuring the transmission of keys, one or both may be required.  

##### EIGRP 
```
interface <interface id> 
ip authentication key-chain eigrp <as> <key chain name>
ip authentication mode eigrp <as> md5
```
##### RIP 
```
interface <interface id>
ip rip authentication key-chain <key chain name>
ip rip authentication mode <text | md5>
```
