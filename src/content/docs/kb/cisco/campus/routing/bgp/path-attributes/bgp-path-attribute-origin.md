---
title: BGP Path Attribute ORIGIN
tags:
  - path-attributes
  - bgp
status: draft
version: 0.0.1
---

Depending on the method used to inject a route into a local BGP table, BGP assigns one of three BGP ORIGIN PA codes: IGP, EGP, or incomplete. The ORIGIN PA provides a general descriptor as to how a particular NLRI was first injected into a router’s BGP table. The `show ip bgp` command includes the three possible values in the legend at the top of the command output

The ORIGIN codes and meanings hide a few concepts that many people find counterintuitive. 
- routes redistributed into BGP from an IGP actually have an ORIGIN code of incomplete. do not confuse EGP with eBGP; an ORIGIN of EGP refers to Exterior Gateway Protocol, the very old and deprecated predecessor to BGP. In practice, the EGP ORIGIN code should not be seen today.

| ORIGIN Code | Cisco IOS Notation | Used for Routes Injected Because of the Following Commands                                   |
| ----- |  | -- |
| IGB         | i                  | network, aggregate-address (in some cases), and neighbor default-originate commands.         |
| EGP         | e                  | Exterior Gateway Protocol (EGP). No specific commands apply.                                 |
| Incomplete  | ?                  | redistribute, aggregate-address (in some cases), and default- information originate command. |
The rules regarding the ORIGIN codes used for summary routes created with the aggregate-address command can also be a bit surprising. The rules are summarized as follows: 
- If the as-set option is not used, the aggregate route uses ORIGIN code i . 
- If the as-set option is used, and all component subnets being summarized use ORIGIN code i , the aggregate has ORIGIN code i . 
- If the as-set option is used, and at least one of the component subnets has an ORIGIN code ? , the aggregate has ORIGIN code ? .

> *Note The BGP ORIGIN PA provides a minor descriptor for the origin of a BGP table entry, which is used as part of the BGP decision process.*
