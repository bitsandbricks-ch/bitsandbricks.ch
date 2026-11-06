---
title: BGP Adding eBGP Routes to the IP Routing Table
tags:
  - ebgp
  - bgp
status: draft
version: 0.0.1
---

Cisco IOS Software uses simple logic when determining which eBGP routes to add to the IP routing table. The only two requirements are as follows: 
- The eBGP route in the BGP table is considered to be a “best” route. 
- If the same prefix has been learned through another IGP or through static routes, the AD for BGP external routes must be lower than the ADs for other routing source(s). 

By default, Cisco IOS considers eBGP routes to have AD 20, which gives eBGP routes a better (lower) AD than any other dynamic routing protocol’s default AD (except for the AD 5 of EIGRP summary routes). The rationale behind the default is that eBGP-learned routes should never be prefixes from within an AS. Under normal conditions, eBGP- learned prefixes should seldom be seen as IGP-learned routes as well, but when they are, the BGP route would win by default. 
BGP sets the AD differently for eBGP routes, iBGP routes, and for local (locally injected) routes with defaults of 20, 200, and 200, respectively. These values can be overridden in two ways, both consistent : 
- By using the `distance bgp external-distance internal-distance local-distance` BGP subcommand, which allows the simple setting of AD for eBGP-learned prefixes, iBGP-learned prefixes, and prefixes injected locally, respectively 
- By changing the AD using the `distance distance {ip-address {wildcard-mask}} [ ip- standard-list | ip-extended-list ]` BGP subcommand

With BGP, the IP address and wildcard mask refer to the IP address used on the neighbor command for that particular neighbor, not the BGP RID or NEXT_HOP of the route. The ACL examines the BGP routes received from the neighbor, assigning the specified AD for any routes matching the ACL with a permit action. 

> Note The actual IP route added to the IP routing table. The route contains the exact same prefix, prefix length, and next-hop IP address as listed in the BGP table—even if the NEXT_HOP PA is an IP address that is not in a connected network. As a result, the IP forwarding process might require a recursive route lookup.
## Backdoor Routes
Having a low default AD (20) for eBGP routes can cause a problem in some topologies. An example in which Enterprise 1 uses its eBGP route to reach network 99.0.0.0 in Enterprise 2. 

However, the two enterprises want to use the OSPF-learned route through the leased line between the two companies. One solution would be to configure the distance command to lower the AD of the OSPF-learned route. However, BGP offers an elegant solution to this particular problem through the use of the network backdoor command. In this case, if the Router configures the network 99.0.0.0 backdoor router BGP subcommand, the following would occur: 
- R1 would use the local AD (default 200) for the eBGP-learned route to network 99.0.0.0. 
- R1 does not advertise 99.0.0.0 with BGP. 
 
Given that logic, R1 can use a network backdoor command for each prefix for which R1 needs to use the private link to reach Enterprise 2. If the OSPF route to each prefix is up and working, R1 uses the OSPF (AD 110) route over the eBGP-learned (AD 20) route through the Internet. If the OSPF route is lost, the two companies can still communicate through the Internet.
