## Locations


### Admin Router

<table>
  <tr>
    <td>
      Path: `/service/(?<serviceid>[0-9a-zA-Z-.]+)`<br/>
      Redirect: `/service/<serviceid>/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/service/(?<serviceid>[0-9a-zA-Z-.]+)/(?<url>.*)`<br/>
      Backend: `$serviceurl`<br/>Description: Proxy to Services running on DC/OS
    </td>
  </tr>
</table>

### Apache Mesos

<table>
  <tr>
    <td>
      Path: `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)`<br/>
      Redirect: `/agent/<agentid>/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)(?<url>.+)`<br/>
      Backend: `$agentaddr:$agentport`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/cache/master/`<br/>
      Backend: `http://leader.mesos:5050/master/`<br/>Cache: 5 seconds
    </td>
  </tr>
  <tr>
    <td>
      Path: `/mesos`<br/>
      Redirect: `/mesos/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/mesos/`<br/>
      Backend: `http://leader.mesos:5050/`
    </td>
  </tr>
</table>

### DC/OS Authentication (OAuth)

<table>
  <tr>
    <td>
      Path: `/acs/api/v1`<br/>
      Backend: `http://127.0.0.1:8101`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/acs/api/v1/auth/`<br/>
      Backend: `http://127.0.0.1:8101`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/login`<br/>
      Redirect: To OpenID Connect Server<br/>Description: User Login
    </td>
  </tr>
</table>

### DC/OS Component Package Manager (Pkgpanda)

<table>
  <tr>
    <td>
      Path: `/pkgpanda/`<br/>
      Backend: `http://<socket>/`<br/>Socket: `/run/dcos/pkgpanda-api.sock`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/pkgpanda/active.buildinfo.full.json`<br/>
      File: `/opt/mesosphere/active.buildinfo.full.json`
    </td>
  </tr>
</table>

### DC/OS Diagnostics (3DT)

<table>
  <tr>
    <td>
      Path: `/system/health/v1`<br/>
      Backend: `http://127.0.0.1:1050`
    </td>
  </tr>
</table>

### DC/OS History

<table>
  <tr>
    <td>
      Path: `/dcos-history-service/`<br/>
      Backend: `http://leader.mesos:15055/`
    </td>
  </tr>
</table>

### DC/OS Log

<table>
  <tr>
    <td>
      Path: `/system/v1/logs/v1/`<br/>
      Backend: `http://<socket>/`<br/>Socket: `/run/dcos/dcos-log.sock`
    </td>
  </tr>
</table>

### DC/OS Metrics

<table>
  <tr>
    <td>
      Path: `/system/v1/metrics/`<br/>
      Backend: `http://<socket>/`<br/>Socket: `/run/dcos/dcos-metrics-master.sock`
    </td>
  </tr>
</table>

### DC/OS Package Manager (Cosmos)

<table>
  <tr>
    <td>
      Path: `/capabilities`<br/>
      Backend: `http://127.0.0.1:7070/capabilities`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/cosmos/service/`<br/>
      Backend: `http://127.0.0.1:7070/service/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/package/`<br/>
      Backend: `http://127.0.0.1:7070/package/`
    </td>
  </tr>
</table>

### Exhibitor (Zookeeper)

<table>
  <tr>
    <td>
      Path: `/exhibitor`<br/>
      Redirect: `/exhibitor/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/exhibitor/`<br/>
      Backend: `http://127.0.0.1:8181/`
    </td>
  </tr>
</table>

### Marathon

<table>
  <tr>
    <td>
      Path: `/marathon`<br/>
      Redirect: `/marathon/`<br/>Deprecated: Use `/service/marathon/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/marathon/`<br/>
      Backend: `http://master.mesos:8080/`<br/>Deprecated: Use `/service/marathon/`
    </td>
  </tr>
</table>

### Mesos DNS

<table>
  <tr>
    <td>
      Path: `/mesos_dns`<br/>
      Redirect: `/mesos_dns/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/mesos_dns/`<br/>
      Backend: `http://master.mesos:8123/`
    </td>
  </tr>
</table>

### Navstar

<table>
  <tr>
    <td>
      Path: `/navstar/lashup/key`<br/>
      Backend: `http://127.0.0.1:62080/lashup/key`
    </td>
  </tr>
</table>

### System

<table>
  <tr>
    <td>
      Path: `/dcos-metadata/`<br/>
      File: `/opt/mesosphere/active/dcos-metadata/etc/`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/dcos-metadata/dcos-version.json`<br/>
      File: `/opt/mesosphere/active/dcos-metadata/etc/dcos-version.json`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/dcos-metadata/ui-config.json`<br/>
      Backend: `http://127.0.0.1:8101`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/metadata`
    </td>
  </tr>
  <tr>
    <td>
      Path: `/system/v1/agent/(?<agentid>[0-9a-zA-Z-]+)(?<type>(/logs/v1|/metrics/v0))(?<url>.*)`<br/>
      Backend: `$agentaddr:61001/system/v1$type$url$is_args$query_string`<br/>Description: Proxy to DC/OS Agent
    </td>
  </tr>
  <tr>
    <td>
      Path: `/system/v1/leader/marathon(?<url>.*)`<br/>
      Backend: `$mleader_host/system/v1$url$is_args$query_string`<br/>Description: Proxy to Marathon Leader
    </td>
  </tr>
  <tr>
    <td>
      Path: `/system/v1/leader/mesos(?<url>.*)`<br/>
      Backend: `http://leader.mesos/system/v1$url$is_args$query_string`<br/>Description: Proxy to Mesos Leader API
    </td>
  </tr>
</table>