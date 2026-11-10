---
title: BGP Purposefully Resetting Peer Connections
tags:
  - bgp
status: draft
version: 0.0.1
---

Reset neighbor connections by using the neighbor shutdown command

```
R1# conf t 
Enter configuration commands, one per line. End with CNTL/Z. 
R1(config)# router bgp 123 
R1(config-router)# neigh 172.16.16.6 shutdown
```

All BGP neighbors can be reset with the `clear ip bgp *` EXEC command, which, like the neighbor shutdown command, resets the neighbor connection, closes the TCP connection to that neighbor, and removes all entries from the BGP table learned from that neighbor.
