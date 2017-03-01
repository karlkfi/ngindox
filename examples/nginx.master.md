## Upstreams

|   |
|---|
| Name: `auth`<br/>Server: `127.0.0.1:8101`<br/>Component: DC/OS Authentication (OAuth) |
| Name: `cosmos`<br/>Server: `127.0.0.1:7070`<br/>Component: DC/OS Package Manager (Cosmos) |
| Name: `dcos_history_service`<br/>Server: `leader.mesos:15055`<br/>Component: DC/OS History |
| Name: `dddt`<br/>Server: `127.0.0.1:1050`<br/>Component: DC/OS Diagnostics (3DT) |
| Name: `exhibitor`<br/>Server: `127.0.0.1:8181`<br/>Component: Exhibitor (Zookeeper) |
| Name: `marathon`<br/>Server: `master.mesos:8080`<br/>Component: Marathon |
| Name: `mesos`<br/>Server: `leader.mesos:5050`<br/>Component: Apache Mesos |
| Name: `mesos_dns`<br/>Server: `master.mesos:8123`<br/>Component: Mesos DNS |
| Name: `metrics`<br/>Server: `unix:/run/dcos/dcos-metrics-master.sock`<br/>Component: DC/OS Metrics |
| Name: `navstar`<br/>Server: `127.0.0.1:62080`<br/>Component: Navstar |

## Locations

|   |
|---|
| Path: `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)`<br/>Redirect: /agent/{agentid}/ |
| Path: `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)(?<url>.+)`<br/>ProxyPass: `$agentaddr:$agentport`<br/>Component: Apache Mesos Agent |
| Path: `/acs/api/v1`<br/>ProxyPass: `http://auth`<br/>Component: DC/OS Authentication (OAuth) |
| Path: `/acs/api/v1/auth/`<br/>ProxyPass: `http://auth`<br/>Component: DC/OS Authentication (OAuth) |
| Path: `/cache/master/`<br/>ProxyPass: `http://mesos/master/`<br/>Proxy: /mesos/master/<br/>Cache: /mesos/master/ |
| Path: `/capabilities`<br/>ProxyPass: `http://cosmos/capabilities`<br/>Component: DC/OS Package Manager (Cosmos) |
| Path: `/cosmos/service/`<br/>ProxyPass: `http://cosmos/service/`<br/>Component: DC/OS Package Manager (Cosmos) |
| Path: `/dcos-history-service/`<br/>ProxyPass: `http://dcos_history_service/`<br/>Component: DC/OS History |
| Path: `/dcos-metadata/` |
| Path: `/dcos-metadata/dcos-version.json` |
| Path: `/dcos-metadata/ui-config.json`<br/>ProxyPass: `http://auth`<br/> |
| Path: `/exhibitor`<br/>Redirect: /exhibitor/ |
| Path: `/exhibitor/`<br/>ProxyPass: `http://exhibitor/`<br/>Component: Exhibitor (Zookeeper) |
| Path: `/login`<br/>Description: undefined<br/>Redirect: To OpenID Connect Server |
| Path: `/marathon`<br/>Redirect: /marathon/<br/>Deprecated: Use /service/marathon/ |
| Path: `/marathon/`<br/>ProxyPass: `http://marathon/`<br/>Component: Marathon<br/>Deprecated: Use /service/marathon/ |
| Path: `/mesos`<br/>Redirect: /mesos/ |
| Path: `/mesos/`<br/>ProxyPass: `http://mesos/`<br/>Component: Apache Mesos Master (Leader) |
| Path: `/mesos_dns`<br/>Redirect: /mesos_dns/ |
| Path: `/mesos_dns/`<br/>ProxyPass: `http://mesos_dns/`<br/>Component: Mesos DNS |
| Path: `/metadata` |
| Path: `/navstar/lashup/key`<br/>ProxyPass: `http://navstar/lashup/key`<br/>Component: Navstar |
| Path: `/package/`<br/>ProxyPass: `http://cosmos/package/`<br/>Component: DC/OS Package Manager (Cosmos) |
| Path: `/pkgpanda/`<br/>ProxyPass: `http://pkgpanda/`<br/>Component: Pkgpanda |
| Path: `/pkgpanda/active.buildinfo.full.json` |
| Path: `/service/(?<serviceid>[0-9a-zA-Z-.]+)`<br/>Redirect: /service/{serviceid}/ |
| Path: `/service/(?<serviceid>[0-9a-zA-Z-.]+)/(?<url>.*)`<br/>ProxyPass: `$serviceurl`<br/>Description: undefined<br/>Proxy: To Service Address |
| Path: `/system/health/v1`<br/>ProxyPass: `http://dddt`<br/>Component: DC/OS Diagnostics (3DT) |
| Path: `/system/v1/agent/(?<agentid>[0-9a-zA-Z-]+)(?<type>(/logs/v1|/metrics/v0))(?<url>.*)`<br/>ProxyPass: `$agentaddr:61001/system/v1$type$url$is_args$query_string`<br/>Description: undefined<br/>Proxy: {agentaddr}:61001/system/v1/ |
| Path: `/system/v1/leader/marathon(?<url>.*)`<br/>ProxyPass: `$mleader_host/system/v1$url$is_args$query_string`<br/>Description: undefined<br/>Proxy: marathon.mesos/system/v1/ |
| Path: `/system/v1/leader/mesos(?<url>.*)`<br/>ProxyPass: `http://leader.mesos/system/v1$url$is_args$query_string`<br/>Description: undefined<br/>Proxy: leader.mesos/system/v1/ |
| Path: `/system/v1/logs/v1/`<br/>ProxyPass: `http://log/`<br/>Component: DC/OS Log |
| Path: `/system/v1/metrics/`<br/>ProxyPass: `http://metrics/`<br/>Component: DC/OS Metrics |
