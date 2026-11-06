---
title: General
---

## Services

| Service Name                        | Description                                              |
|----------------------------------------|--------------------------------------------------------------|
| `apic-em-event-service`                | Handles SNMP trap events and host discovery via SNMP         |
| `apic-em-inventory-manager-service`    | Manages communication between inventory and discovery        |
| `apic-em-jboss-ejbca`                  | Certificate authority for DNAC controller authority          |
| `apic-em-network-programmer-service`   | Configures devices; critical during provisioning             |
| `apic-em-pki-broker-service`           | PKI certificate authority handling                           |
| `command-runner-service`               | Executes CLI commands (Command Runner feature)               |
| `distributed-cache-service`            | Infrastructure-level caching                                 |
| `postgres`                             | Core database management system                              |
| `dna-common-service`                   | DNAC and ISE integration tasks                               |
| `identity-manager-pxgrid-service`      | DNAC-ISE integration component                               |
| `network-orchestration-service`        | Device provisioning orchestration                            |
| `orchestration-engine-service`         | General orchestration handler                                |
| `spf-device-manager-service`           | Core service during device provisioning                      |
| `spf-service-manager-service`          | Manages provisioning services                                |
| `policy-analysis-service`              | Handles policy analysis tasks                                |
| `policy-manager-service`               | Manages network policies                                     |
| `rbac-broker-service`                  | Role-Based Access Control (RBAC) service                     |
| `pnp-service`                          | Plug and Play (PNP) device onboarding                        |
| `swim-service`                         | Software Image Management (SWIM)                             |
| `ipam-service`                         | IP Address Manager                                           |
| `dna-maps-service`                     | Manages map-related functionality                            |
| `dna-wireless-service`                 | Manages wireless services                                    |
| `sensor-manager`                       | Manages and monitors network sensors                         |
| `site-profile-service`                 | Handles site profiling and configurations                    |
View the service status
```
magctl appstack status
magctl service status <service>
```

Restart a service with the following command. “-d” deletes the container and recreates it.
Restart Service (Docker Container)
```
magctl service restart -d <service>
```

As of 2.1.x as soon as TACACS / Radius authentication is possible. Local login doesn’t work anymore. The following commands enable / disable local authentication.
Enable / Disable Local Authentication
```
magctl rbac external_auth_fallback display
magctl rbac external_auth_fallback enable
magctl rbac external_auth_fallback disable
```

Logging
DNA Center Logs are usually in JSON format.”lql” can be used to format the logs for better readability.
```
magctl service logs -rf <service> | lql
```

Catalog Server Logs
```
magctl service logs -rf catalogserver | grep -i -e pull -e push -e download -e checksum -e layer -e connectdna -e allversion -e failed -e failure -e timeout -e exception -e meta -e exception -e checksum -e error | lql
```

Upgrade
```
$ maglev catalog settings display
$ maglev catalog release_channel display -V
$ maglev package status
```

UPGRADE TASK - "SYSTEM UPDATE"
```
$ maglev catalog system_update_package display   
$ maglev system_updater update_info
$ maglev system_updater update_info -s
   You can use the above command as a fallback and this is only available after the CLI is
 updated in SW 1.3+
$ maglev system_update_package status
$ maglev catalog package status system
```

```
$ watch -d -n 0.5 'maglev catalog system_update_package display'
$ watch -d -n 0.5 "maglev system_updater update_info"
$ watch -d -n 0.5 "maglev catalog package status system"
$ watch -d -n 0.5 "maglev system_update_package status"
```

### UPGRADE TASK - APPLICATION PACKAGES  "DOWNLOAD ALL"
```
maglev catalog package display
```

UPGRADE TASK - APPLICATION PACKAGES - "INSTALL OR UPDATE ALL"
```
$ maglev package status | grep %
$ watch -d -n 0.5 "maglev package status | grep %"
```

CLI Commands to  monitor logs during an Upgrade
Services logs to look at for debugs: catalogserver, system-updater, maglevserver, workflow-worker

```
$ magctl service logs -rf <upgrade related service name> | lql
$ magctl service logs -rf catalog | grep -i -e download -e pull -e push -e connectdna 
-e layer -e exception -e error | lql
$ magctl service logs -r system-updater | lql > system_updater.log
```

Logs for node update operations(from each node)
```
/var/log/maglev-node-updater-<node-name>.log    
```
Note: node-name is the node ip address shown in below command

```
$ kubectl get node
```

Useful Commands
View the upgrade status in the cli
show upgrade status in the CLI
```
maglev system_updater update_info
```

catalogue ist the repo for all the new packages to be downloaded / upgraded
View the catalog settings
```
maglev catalog settings display
```

Shows the current status of all installed / available applications (apps)
View the catalog packages status
```
maglev catalog package display
```

Shows the current installation status of all installed applications (apps)
View the apps packages status
```
maglev package status
```

View the 
```
magctl workflow status
magctl workflow revoke <ID>

magctl workflow status
magctl workflow revoke <ID>
```

Change catalog to 2.1.2
```
maglev catalog settings display
magctl service unsetenv catalogserver PARENT_CATALOG_SERVER_REPOSITORY
magctl service unsetenv catalogserver PARENT_CATALOG_SERVER
magctl service unsetenv catalogserver PARENT_CATALOG_OVERRIDE
magctl service setenv catalogserver PARENT_CATALOG_SERVER_REPOSITORY dnac212
maglev catalog check_for_updates
maglev catalog package display
```

Download Packages CLI
```
for package in $(maglev catalog package display -o json | jq -r '.[] | .name'); do maglev catalog package pull $package;done
```

```
