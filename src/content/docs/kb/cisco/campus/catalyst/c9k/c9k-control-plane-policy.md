---
title: C9K Control Plane Policy
tags:
  - copp
  - c9k
status: draft
version: 0.0.1
---

###### Why FED is Punting Packets to the Control Plane:
```
show platform software fed switch active punt cause summary
```
###### Show CPU Queues
```
show platform software fed switch active cpu-interface
```
###### More details for the queues
```
show platform software fed switch active punt cpuq all
sh platform software fed switch active punt cpuq br
```
###### View COPP Policy for the Queues
```
show platform hardware fed switch 1 qos queue stats internal cpu policer
```
###### View COPP Policy / Class Info
In order to see what matching logic each class uses, you have a CLI to help identify packet types that hits a certain queue. For example, if you want to know what would hit the system-cpp-routing-control class

```
show platform software qos copp policy-info
show platform software qos copp class-info
```
