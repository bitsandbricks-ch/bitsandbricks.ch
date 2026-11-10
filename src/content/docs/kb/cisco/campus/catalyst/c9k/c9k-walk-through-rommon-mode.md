---
title: C9K Walk through ROMMON mode
tags:
  - rommon
  - c9k
status: draft
version: 0.0.1
---

```
set  
dir flash:  
cat flash:packages.conf  
set MANUAL_BOOT=no  
set BOOT=flash:<image>  
boot  
boot <filesystem>:<image>
```
