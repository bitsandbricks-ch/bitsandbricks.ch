---
title: Device Internal Error
---

```
#!/bin/bash
read -p "DNAC IP: " IP
read -p "DEVICE ID: " DEVICEID
read -p "Username: " USERNAME
read -p "Enter your password: " -s PASSWORD

TOKEN=`curl -X POST -u $USERNAME:$PASSWORD -s https://${IP}/api/system/v1/identitymgmt/token --insecure | jq '.Token' | tr -d '"'`
curl -X PUT -H "content-type: application/json" -H "X-AUTH-TOKEN:$TOKEN" -d "$DEVICEID" "https://${IP}/api/v1/network-device/sync-with-cleanup?forceSync=true" --insecure
```
