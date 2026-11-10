---
title: EIGRP Unequal-Cost Load Balancing
tags:
  - eigrp
status: draft
version: 0.0.1
---

EIGRP supports unequal-cost load balancing, which allows installation of both successor routes and feasible successors into the EIGRP RIB. 

EIGRP supports unequal-cost load balancing by changing EIGRP variance multiplier. 
The EIGRP variance value is the feasible distance (FD) for a route multiplied by the EIGRP variance multiplier. Any feasible successor’s FD with a metric below the EIGRP variance value is installed into the RIB. 

EIGRP installs multiple routes where the feasible distance of the routes is less than the EIGRP variance value up to the maximum number of ECMP routes, as discussed earlier.
Dividing the feasible successor metric by the successor route metric provides the variance multiplier. The variance multiplier is a whole number, so any remainders should always round up.
