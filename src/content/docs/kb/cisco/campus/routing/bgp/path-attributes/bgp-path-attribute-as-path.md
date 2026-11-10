---
title: BGP Path Attribute AS_PATH
tags:
  - path-attributes
  - bgp
status: draft
version: 0.0.1
---

The AS_PATH PA consists of up to four different components, called segments, as follows: 
- AS_SEQ (short for AS Sequence) 
- AS_SET 
- AS_CONFED_SEQ (short for AS Confederation Sequence) 
- AS_CONFED_SET 

The most commonly used segment is called AS_SEQ. 
## AS_SEQ
Is the idea of AS_PATH with the PA representing all ASNs, in order, through which the route has been advertised.
