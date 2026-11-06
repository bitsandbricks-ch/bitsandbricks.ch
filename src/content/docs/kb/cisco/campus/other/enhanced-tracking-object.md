---
title: Enhanced Tracking Object
tags:
  - other
status: draft
version: 0.0.1
---

A tracking object is like a conditional variable stored in IOS that represents an “UP” or “DOWN” value based on a specific criterion. These objects can be made to keep track of interface status, routes in the routing table, and IP SLA operations. Tracking objects can be applied to static routes making the static routes conditional. If the tracking object returns “UP” then the static route is allowed to enter the routing table. Otherwise, the static route is not added to the routing table. Enhanced tracking objects are configured with the track object-number command in global configuration mode.

## Track IP Route

```
track 2 ip route 2.0.0.0 255.0.0.0 reachbility
track 3 ip route 3.0.0.0/8 reachability
```

The reachability keyword adds the condition that, for the tracking object to return “UP”, the route must exist in the routing table. Notice the track command accepts both address/mask and prefix/prefix-length formats for IP routes

## Conditional Tracking Object

An enhanced tracking object list can take the status of multiple individual tracking objects and based on the configured matching logic, determine if the sum of all the included tracking objects should evaluate to “UP” or “DOWN”. The matching logic can be boolean or based on a defined threshold.

```
track 1 list boolean and 
 object 2 
 object 3
 object 4 not
```

Optionally the not keyword can be added to negate the status of the object

This can be pushed even further to create more complex tracking objects

```
track 4 list boolean and 
 object 2 
 object 3
track 5 list boolean and 
 object 6 
 object 7
! if (2 and 3) or (6 and 7)
track 1 boolean or
 object 4
 object 5
```
