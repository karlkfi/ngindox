## Upstreams

| Name | Server | Description |
|------|--------|-------------|
| `mesos` | `leader.mesos:5050` |  Component: Apache Mesos |
| `marathon` | `master.mesos:8080` |  Component: Marathon |
| `dcos_history_service` | `leader.mesos:15055` |  Component: DC/OS History |
| `mesos_dns` | `master.mesos:8123` |  Component: Mesos DNS |
| `exhibitor` | `127.0.0.1:8181` |  Component: Exhibitor (Zookeeper) |
| `cosmos` | `127.0.0.1:7070` |  Component: DC/OS Package Manager (Cosmos) |
| `auth` | `127.0.0.1:8101` |  Component: DC/OS Authentication (OAuth) |
| `dddt` | `127.0.0.1:1050` |  Component: DC/OS Diagnostics (3DT) |
| `metrics` | `unix:/run/dcos/dcos-metrics-master.sock` |  Component: DC/OS Metrics |
| `navstar` | `127.0.0.1:62080` |  Component: Navstar |

## Locations

| Path | ProxyPass | Description |
|------|-----------|-------------|
| `/login` |   |  Login |
| `/acs/api/v1/auth/` | `http://auth` |  Component: DC/OS Authentication (OAuth) |
| `/acs/api/v1` | `http://auth` |  Component: DC/OS Authentication (OAuth) |
| `/mesos` |   |  Redirect: /mesos/ |
| `/mesos/` | `http://mesos/` |  Component: Apache Mesos Master (Leader) |
| `/package/` | `http://cosmos/package/` |  Component: DC/OS Package Manager (Cosmos) |
| `/capabilities` | `http://cosmos/capabilities` |  Component: DC/OS Package Manager (Cosmos) |
| `/cosmos/service/` | `http://cosmos/service/` |  Component: DC/OS Package Manager (Cosmos) |
| `/cache/master/` | `http://mesos/master/` |  Mesos Master Cache (5 seconds) |
| `/exhibitor` |   |  Redirect: /exhibitor/ |
| `/exhibitor/` | `http://exhibitor/` |  Component: Exhibitor (Zookeeper) |
| `/navstar/lashup/key` | `http://navstar/lashup/key` |  Component: Navstar |
| `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)` |   |  Redirect: /agent/<agentid>/ |
| `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)(?<url>.+)` | `$agentaddr:$agentport` |  Component: Apache Mesos Agent |
| `/service/(?<serviceid>[0-9a-zA-Z-.]+)` |   |  Redirect: /service/<serviceid>/ |
| `/service/(?<serviceid>[0-9a-zA-Z-.]+)/(?<url>.*)` | `$serviceurl` |  DC/OS Service Proxy |
| `/metadata` |   |  |
| `/dcos-metadata/ui-config.json` | `http://auth` |  TODO split this into its own file |
| `/dcos-metadata/dcos-version.json` |   |  |
| `/dcos-metadata/` |   |  |
| `/marathon` |   |  Deprecated. Use /service/marathon/ |
| `/marathon/` | `http://marathon/` |  TODO(cmaloney): Make the Web UI work in a subdirectory.  Deprecated. Use /service/marathon/ |
| `/pkgpanda/active.buildinfo.full.json` |   |  |
| `/dcos-history-service/` | `http://dcos_history_service/` |  Component: DC/OS History |
| `/mesos_dns` |   |  Redirect: /mesos_dns/ |
| `/mesos_dns/` | `http://mesos_dns/` |  Component: Mesos DNS |
| `/pkgpanda/` | `http://pkgpanda/` |  |
| `/system/health/v1` | `http://dddt` |  Component: DC/OS Diagnostics (3DT) |
| `/system/v1/logs/v1/` | `http://log/` |  Component: DC/OS Log |
| `/system/v1/metrics/` | `http://metrics/` |  Component: DC/OS Metrics |
| `/system/v1/leader/mesos(?<url>.*)` | `http://leader.mesos/system/v1$url$is_args$query_string` |  Mesos Leader Proxy |
| `/system/v1/leader/marathon(?<url>.*)` | `$mleader_host/system/v1$url$is_args$query_string` |  Marathon Leader Proxy |
| `/system/v1/agent/(?<agentid>[0-9a-zA-Z-]+)(?<type>(/logs/v1|/metrics/v0))(?<url>.*)` | `$agentaddr:61001/system/v1$type$url$is_args$query_string` |  DC/OS Agent Proxy |

