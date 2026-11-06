---
title: STP - RSTP 802.1W - Port States
tags:
  - stp
  - rstp
status: draft
version: 0.0.1
---

|   |   |   |
|---|---|---|
|RSTP Port State|Desc|STP Port State|
|Discarding|The switch port is enabled, but the port is not forwarding any traffic to ensure that a loop is not created.|disabled, blocking, and listening.|
|Learning|The switch port modifies the MAC address table with any network traffic it<br><br>receives. The switch still does not forward any other network traffic besides BPDUs.|Learning|
|Forwarding|The switch port forwards all network traffic and updates the MAC address table as expected. <br><br>This is the final state for a switch port to forward network traffic.|Forwarding|
