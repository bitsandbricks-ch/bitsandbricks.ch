---
title: Event Manager CatchAll
---

event manager applet catchall
event cli replacement ".*" sync no skip no
action 1 syslog msg "$_cli_msg"
end
