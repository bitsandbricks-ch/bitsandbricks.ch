---
title: OSPF Default Route Injection
tags:
  - ospf
status: draft
version: 0.0.1
---

## Default Route Injection
The always keyword injects the route even when no default route is present on the Router itself

```
default-information originate {always}
```
## Conditional Default Route Injection 
only when certain Routes are present in the Routing Table of the Injecting router. Statements in the Prefix List or Access List are treated as OR statements. 

To create a logical AND operation one can use multiple Permit Statements in the Route-Map . The route-map will only evaluate if both access-lists or prefix lists produce a match
```
default-information originate route-map TEST
```

## Complex Default Route Injection

If no route map can be used or other more complex injection methods should be used tracking objects can be used in combination with a default null route on the Router as the per default the route will only be injected when a default route is present on the Router.

Also see Enhanced Tracking Object for more details

```
track 2 ip route 2.0.0.0 255.0.0.0 reachability
track 3 ip route 3.0.0.0 255.0.0.0 reachability
track 1 list boolean and
 object 2
 object 3

ip route 0.0.0.0 0.0.0.0 Null0 track 1

router ospf 1
 default-information originate
```

## Very Complex Default Route Injection (why?)

The above mentioned examples can be even leveraged to use in combination (don't ask me why you would use this)

Instead of applying the `track 1` object to a default route one can add a random static route (APIPA for example) which then is matched by a prefix-list / route-map

```
ip prefix-list NET permit 169.254.0.0/16

route-map tst permit 10
 match ip address prefix NET
 
router ospf 1
 default-information originate route-map tst

ip route 169.254.0.0 255.255.0.0 null0 track 1
```
