## Locations


### Admin Router

<table>
  <tr>
    <td>
      Path: <pre><code>/service/(?<serviceid>[0-9a-zA-Z-.]+)</code></pre><br/>
      Redirect: `/service/<serviceid>/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/service/(?<serviceid>[0-9a-zA-Z-.]+)/(?<url>.*)</code></pre><br/>
      Backend: <pre><code>$serviceurl</code></pre><br/>Description: Proxy to Services running on DC/OS
    </td>
  </tr>
</table>

### Apache Mesos

<table>
  <tr>
    <td>
      Path: <pre><code>/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)</code></pre><br/>
      Redirect: `/agent/<agentid>/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/(slave|agent)/(?<agentid>[0-9a-zA-Z-]+)(?<url>.+)</code></pre><br/>
      Backend: <pre><code>$agentaddr:$agentport</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/cache/master/</code></pre><br/>
      Backend: <pre><code>http://leader.mesos:5050/master/</code></pre><br/>Cache: 5 seconds
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/mesos</code></pre><br/>
      Redirect: `/mesos/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/mesos/</code></pre><br/>
      Backend: <pre><code>http://leader.mesos:5050/</code></pre>
    </td>
  </tr>
</table>

### DC/OS Authentication (OAuth)

<table>
  <tr>
    <td>
      Path: <pre><code>/acs/api/v1</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:8101</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/acs/api/v1/auth/</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:8101</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/login</code></pre><br/>
      Redirect: To OpenID Connect Server<br/>Description: User Login
    </td>
  </tr>
</table>

### DC/OS Component Package Manager (Pkgpanda)

<table>
  <tr>
    <td>
      Path: <pre><code>/pkgpanda/</code></pre><br/>
      Backend: <pre><code>http://<socket>/</code></pre><br/>Socket: <pre><code>/run/dcos/pkgpanda-api.sock</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/pkgpanda/active.buildinfo.full.json</code></pre><br/>
      File: <pre><code>/opt/mesosphere/active.buildinfo.full.json</code></pre>
    </td>
  </tr>
</table>

### DC/OS Diagnostics (3DT)

<table>
  <tr>
    <td>
      Path: <pre><code>/system/health/v1</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:1050</code></pre>
    </td>
  </tr>
</table>

### DC/OS History

<table>
  <tr>
    <td>
      Path: <pre><code>/dcos-history-service/</code></pre><br/>
      Backend: <pre><code>http://leader.mesos:15055/</code></pre>
    </td>
  </tr>
</table>

### DC/OS Log

<table>
  <tr>
    <td>
      Path: <pre><code>/system/v1/logs/v1/</code></pre><br/>
      Backend: <pre><code>http://<socket>/</code></pre><br/>Socket: <pre><code>/run/dcos/dcos-log.sock</code></pre>
    </td>
  </tr>
</table>

### DC/OS Metrics

<table>
  <tr>
    <td>
      Path: <pre><code>/system/v1/metrics/</code></pre><br/>
      Backend: <pre><code>http://<socket>/</code></pre><br/>Socket: <pre><code>/run/dcos/dcos-metrics-master.sock</code></pre>
    </td>
  </tr>
</table>

### DC/OS Package Manager (Cosmos)

<table>
  <tr>
    <td>
      Path: <pre><code>/capabilities</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:7070/capabilities</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/cosmos/service/</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:7070/service/</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/package/</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:7070/package/</code></pre>
    </td>
  </tr>
</table>

### Exhibitor (Zookeeper)

<table>
  <tr>
    <td>
      Path: <pre><code>/exhibitor</code></pre><br/>
      Redirect: `/exhibitor/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/exhibitor/</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:8181/</code></pre>
    </td>
  </tr>
</table>

### Marathon

<table>
  <tr>
    <td>
      Path: <pre><code>/marathon</code></pre><br/>
      Redirect: `/marathon/`<br/>Deprecated: Use `/service/marathon/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/marathon/</code></pre><br/>
      Backend: <pre><code>http://master.mesos:8080/</code></pre><br/>Deprecated: Use `/service/marathon/`
    </td>
  </tr>
</table>

### Mesos DNS

<table>
  <tr>
    <td>
      Path: <pre><code>/mesos_dns</code></pre><br/>
      Redirect: `/mesos_dns/`
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/mesos_dns/</code></pre><br/>
      Backend: <pre><code>http://master.mesos:8123/</code></pre>
    </td>
  </tr>
</table>

### Navstar

<table>
  <tr>
    <td>
      Path: <pre><code>/navstar/lashup/key</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:62080/lashup/key</code></pre>
    </td>
  </tr>
</table>

### System

<table>
  <tr>
    <td>
      Path: <pre><code>/dcos-metadata/</code></pre><br/>
      File: <pre><code>/opt/mesosphere/active/dcos-metadata/etc/</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/dcos-metadata/dcos-version.json</code></pre><br/>
      File: <pre><code>/opt/mesosphere/active/dcos-metadata/etc/dcos-version.json</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/dcos-metadata/ui-config.json</code></pre><br/>
      Backend: <pre><code>http://127.0.0.1:8101</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/metadata</code></pre>
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/system/v1/agent/(?<agentid>[0-9a-zA-Z-]+)(?<type>(/logs/v1|/metrics/v0))(?<url>.*)</code></pre><br/>
      Backend: <pre><code>$agentaddr:61001/system/v1$type$url$is_args$query_string</code></pre><br/>Description: Proxy to DC/OS Agent
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/system/v1/leader/marathon(?<url>.*)</code></pre><br/>
      Backend: <pre><code>$mleader_host/system/v1$url$is_args$query_string</code></pre><br/>Description: Proxy to Marathon Leader
    </td>
  </tr>
  <tr>
    <td>
      Path: <pre><code>/system/v1/leader/mesos(?<url>.*)</code></pre><br/>
      Backend: <pre><code>http://leader.mesos/system/v1$url$is_args$query_string</code></pre><br/>Description: Proxy to Mesos Leader API
    </td>
  </tr>
</table>
