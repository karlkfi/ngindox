## Locations


### Apache Mesos

|   |
|---|
| Path: `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)`<br/>Redirect: `/agent/<agentid>/` |
| Path: `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)(?<url>.+)`<br/> |
| Path: `/cache/master/`<br/>Cache: 5 seconds<br/>Backend: http://leader.mesos:5050/master/ |
| Path: `/mesos`<br/>Redirect: `/mesos/` |
| Path: `/mesos/`<br/>Backend: http://leader.mesos:5050/ |

### DC/OS Authentication (OAuth)

|   |
|---|
| Path: `/acs/api/v1`<br/>Backend: http://127.0.0.1:8101 |
| Path: `/acs/api/v1/auth/`<br/>Backend: http://127.0.0.1:8101 |
| Path: `/login`<br/>Description: User Login<br/>Redirect: To OpenID Connect Server |

### DC/OS Component Package Manager (Pkgpanda)

|   |
|---|
| Path: `/pkgpanda/`<br/> |
| Path: `/pkgpanda/active.buildinfo.full.json`<br/> |

### DC/OS Diagnostics (3DT)

|   |
|---|
| Path: `/system/health/v1`<br/>Backend: http://127.0.0.1:1050 |

### DC/OS History

|   |
|---|
| Path: `/dcos-history-service/`<br/>Backend: http://leader.mesos:15055/ |

### DC/OS Log

|   |
|---|
| Path: `/system/v1/logs/v1/`<br/> |

### DC/OS Metrics

|   |
|---|
| Path: `/system/v1/metrics/`<br/>Backend: http://unix:/run/dcos/dcos-metrics-master.sock/ |

### DC/OS Package Manager (Cosmos)

|   |
|---|
| Path: `/capabilities`<br/>Backend: http://127.0.0.1:7070/capabilities |
| Path: `/cosmos/service/`<br/>Backend: http://127.0.0.1:7070/service/ |
| Path: `/package/`<br/>Backend: http://127.0.0.1:7070/package/ |

### Exhibitor (Zookeeper)

|   |
|---|
| Path: `/exhibitor`<br/>Redirect: `/exhibitor/` |
| Path: `/exhibitor/`<br/>Backend: http://127.0.0.1:8181/ |

### Marathon

|   |
|---|
| Path: `/marathon`<br/>Redirect: `/marathon/`<br/>Deprecated: Use `/service/marathon/` |
| Path: `/marathon/`<br/>Deprecated: Use `/service/marathon/`<br/>Backend: http://master.mesos:8080/ |

### Mesos DNS

|   |
|---|
| Path: `/mesos_dns`<br/>Redirect: `/mesos_dns/` |
| Path: `/mesos_dns/`<br/>Backend: http://leader.mesos:5050_dns/ |

### Navstar

|   |
|---|
| Path: `/navstar/lashup/key`<br/>Backend: http://127.0.0.1:62080/lashup/key |

### Other

|   |
|---|
| Path: `/service/(?<serviceid>[0-9a-zA-Z-.]+)`<br/>Redirect: `/service/<serviceid>/` |
| Path: `/service/(?<serviceid>[0-9a-zA-Z-.]+)/(?<url>.*)`<br/>Description: Proxy to Services running on DC/OS |

### System

|   |
|---|
| Path: `/dcos-metadata/`<br/> |
| Path: `/dcos-metadata/dcos-version.json`<br/> |
| Path: `/dcos-metadata/ui-config.json`<br/>Backend: http://127.0.0.1:8101 |
| Path: `/metadata`<br/> |
| Path: `/system/v1/agent/(?<agentid>[0-9a-zA-Z-]+)(?<type>(/logs/v1|/metrics/v0))(?<url>.*)`<br/>Description: Proxy to DC/OS Agent<br/>Backend: `<agentaddr>:61001/system/v1/` |
| Path: `/system/v1/leader/marathon(?<url>.*)`<br/>Description: Proxy to Marathon Leader<br/>Backend: `marathon.mesos/system/v1/` |
| Path: `/system/v1/leader/mesos(?<url>.*)`<br/>Description: Proxy to Mesos Leader API<br/>Backend: `leader.mesos/system/v1/` |
