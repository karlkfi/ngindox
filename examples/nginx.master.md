## Locations


### Admin Router

<table>
  <tr>
    <td>
      Path: <code>/service/(?&lt;serviceid&gt;[0-9a-zA-Z-.]+)</code><br/>
      Redirect: `/service/<serviceid>/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/service/(?&lt;serviceid&gt;[0-9a-zA-Z-.]+)/(?&lt;url&gt;.*)</code><br/>
      Backend: <code>$serviceurl</code><br/>Description: Proxy to Services running on DC/OS
    </td>
  </tr>
</table>

### Apache Mesos

<table>
  <tr>
    <td>
      Path: <code>/(slave|agent)/(?&lt;agentid&gt;[0-9a-zA-Z-]+)</code><br/>
      Redirect: `/agent/<agentid>/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/(slave|agent)/(?&lt;agentid&gt;[0-9a-zA-Z-]+)(?&lt;url&gt;.+)</code><br/>
      Backend: <code>$agentaddr:$agentport</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/cache/master/</code><br/>
      Backend: <code>http://leader.mesos:5050/master/</code><br/>Cache: 5 seconds
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/mesos</code><br/>
      Redirect: `/mesos/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/mesos/</code><br/>
      Backend: <code>http://leader.mesos:5050/</code>
    </td>
  </tr>
</table>

### DC/OS Authentication (OAuth)

<table>
  <tr>
    <td>
      Path: <code>/acs/api/v1</code><br/>
      Backend: <code>http://127.0.0.1:8101</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/acs/api/v1/auth/</code><br/>
      Backend: <code>http://127.0.0.1:8101</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/login</code><br/>
      Redirect: To OpenID Connect Server<br/>Description: User Login
    </td>
  </tr>
</table>

### DC/OS Component Package Manager (Pkgpanda)

<table>
  <tr>
    <td>
      Path: <code>/pkgpanda/</code><br/>
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/pkgpanda-api.sock</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/pkgpanda/active.buildinfo.full.json</code><br/>
      File: <code>/opt/mesosphere/active.buildinfo.full.json</code>
    </td>
  </tr>
</table>

### DC/OS Diagnostics (3DT)

<table>
  <tr>
    <td>
      Path: <code>/system/health/v1</code><br/>
      Backend: <code>http://127.0.0.1:1050</code>
    </td>
  </tr>
</table>

### DC/OS History

<table>
  <tr>
    <td>
      Path: <code>/dcos-history-service/</code><br/>
      Backend: <code>http://leader.mesos:15055/</code>
    </td>
  </tr>
</table>

### DC/OS Log

<table>
  <tr>
    <td>
      Path: <code>/system/v1/logs/v1/</code><br/>
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/dcos-log.sock</code>
    </td>
  </tr>
</table>

### DC/OS Metrics

<table>
  <tr>
    <td>
      Path: <code>/system/v1/metrics/</code><br/>
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/dcos-metrics-master.sock</code>
    </td>
  </tr>
</table>

### DC/OS Package Manager (Cosmos)

<table>
  <tr>
    <td>
      Path: <code>/capabilities</code><br/>
      Backend: <code>http://127.0.0.1:7070/capabilities</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/cosmos/service/</code><br/>
      Backend: <code>http://127.0.0.1:7070/service/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/package/</code><br/>
      Backend: <code>http://127.0.0.1:7070/package/</code>
    </td>
  </tr>
</table>

### Exhibitor (Zookeeper)

<table>
  <tr>
    <td>
      Path: <code>/exhibitor</code><br/>
      Redirect: `/exhibitor/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/exhibitor/</code><br/>
      Backend: <code>http://127.0.0.1:8181/</code>
    </td>
  </tr>
</table>

### Marathon

<table>
  <tr>
    <td>
      Path: <code>/marathon</code><br/>
      Redirect: `/marathon/`<br/>Deprecated: Use `/service/marathon/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/marathon/</code><br/>
      Backend: <code>http://master.mesos:8080/</code><br/>Deprecated: Use `/service/marathon/`
    </td>
  </tr>
</table>

### Mesos DNS

<table>
  <tr>
    <td>
      Path: <code>/mesos_dns</code><br/>
      Redirect: `/mesos_dns/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/mesos_dns/</code><br/>
      Backend: <code>http://master.mesos:8123/</code>
    </td>
  </tr>
</table>

### Navstar

<table>
  <tr>
    <td>
      Path: <code>/navstar/lashup/key</code><br/>
      Backend: <code>http://127.0.0.1:62080/lashup/key</code>
    </td>
  </tr>
</table>

### System

<table>
  <tr>
    <td>
      Path: <code>/dcos-metadata/</code><br/>
      File: <code>/opt/mesosphere/active/dcos-metadata/etc/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/dcos-metadata/dcos-version.json</code><br/>
      File: <code>/opt/mesosphere/active/dcos-metadata/etc/dcos-version.json</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/dcos-metadata/ui-config.json</code><br/>
      Backend: <code>http://127.0.0.1:8101</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/metadata</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/system/v1/agent/(?&lt;agentid&gt;[0-9a-zA-Z-]+)(?&lt;type&gt;(/logs/v1|/metrics/v0))(?&lt;url&gt;.*)</code><br/>
      Backend: <code>$agentaddr:61001/system/v1$type$url$is_args$query_string</code><br/>Description: Proxy to DC/OS Agent
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/system/v1/leader/marathon(?&lt;url&gt;.*)</code><br/>
      Backend: <code>$mleader_host/system/v1$url$is_args$query_string</code><br/>Description: Proxy to Marathon Leader
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/system/v1/leader/mesos(?&lt;url&gt;.*)</code><br/>
      Backend: <code>http://leader.mesos/system/v1$url$is_args$query_string</code><br/>Description: Proxy to Mesos Leader API
    </td>
  </tr>
</table>
