---
title: "Sample note: a one-liner worth keeping"
summary: Sample short note. Severity 6 shows it as a note instead of a full post.
date: 2026-10-19
facility: homelab
severity: 6
tags: [kubernetes, homelab]
sample: true
---

Short notes use `severity: 6` in the frontmatter and show up as `%HOMELAB-6-NOTE` in the list.

```
kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx
```
