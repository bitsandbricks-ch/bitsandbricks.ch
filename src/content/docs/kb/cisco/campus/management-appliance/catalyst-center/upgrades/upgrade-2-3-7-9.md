---
title: Upgrade 2.3.7.9
tags:
  - upgrades
status: draft
version: 0.0.1
---

# CSCwn53856

An upgrade from 2.3.7.7 to 2.3.7.9 failed with ACA chart download failed error
### Symptom
The upgrade from the 2.3.7.7-VA to 2.3.7.9-VA release is failing for IPv6 clusters. Group-Based Policy Analytics (GBPA) optional package is available for installation in the 2.3.7.7-VA IPv6 release and in the 2.3.7.9-VA IPv6 release, the package was marked as not supported. Access Control Application (ACA) dependency was added for GBPA in the 2.3.7.9-VA IPv6 release. 
### Conditions
While upgrading an IPv6 VA Cluster from the 2.3.7.7-VA to the 2.3.7.9-VA or 2.3.7.10 VA release, if the Group-Based Policy Analytics (GBPA) optional package was already installed, it expects the Access Control Application (ACA) optional package dependency to also be installed during upgrading and failing. 
### Workaround:
NA 
### Further Problem Description: 
GROUP BASED POLICY ANALYTICS (GBPA) optional package was available for installation in 2.3.7.7-VA IPv6 release and in 2379-VA IPv6 release, the package was marked as not supported. Access Control Application (ACA) dependency was added for GBPA in 2379-VA IPv6 release. So, during upgrade, it expects Access Control Application (ACA) optional package dependency to be installed and failing as it is not available.
