<ul>
  <li><a href="#admin-router">Admin Router</a></li>
  <li><a href="#apache-mesos">Apache Mesos</a></li>
  <li><a href="#dcos-authentication-oauth">DC/OS Authentication (OAuth)</a></li>
  <li><a href="#dcos-component-package-manager-pkgpanda">DC/OS Component Package Manager (Pkgpanda)</a></li>
  <li><a href="#dcos-diagnostics-3dt">DC/OS Diagnostics (3DT)</a></li>
  <li><a href="#dcos-history">DC/OS History</a></li>
  <li><a href="#dcos-log">DC/OS Log</a></li>
  <li><a href="#dcos-metrics">DC/OS Metrics</a></li>
  <li><a href="#dcos-package-manager-cosmos">DC/OS Package Manager (Cosmos)</a></li>
  <li><a href="#exhibitor-zookeeper">Exhibitor (Zookeeper)</a></li>
  <li><a href="#marathon">Marathon</a></li>
  <li><a href="#mesos-dns">Mesos DNS</a></li>
  <li><a href="#navstar">Navstar</a></li>
  <li><a href="#system">System</a></li>
</ul>


<h3><a id="admin-router" href="#admin-router" aria-hidden="true">Admin Router</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/service/(?&lt;serviceid&gt;[0-9a-zA-Z-.]+)</code><br/>
      Redirect: <code>/service/&lt;serviceid&gt;/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/service/(?&lt;serviceid&gt;[0-9a-zA-Z-.]+)/(?&lt;url&gt;.*)</code><br/>
      Backend: <code>$serviceurl</code><br/>Description: Proxy to Services running on DC/OS
    </td>
  </tr>
</table>

<h3><a id="apache-mesos" href="#apache-mesos" aria-hidden="true">Apache Mesos</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/(slave|agent)/(?&lt;agentid&gt;[0-9a-zA-Z-]+)</code><br/>
      Redirect: <code>/agent/&lt;agentid&gt;/</code>
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
      Redirect: <code>/mesos/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/mesos/</code><br/>
      Backend: <code>http://leader.mesos:5050/</code>
    </td>
  </tr>
</table>

<h3><a id="dcos-authentication-oauth" href="#dcos-authentication-oauth" aria-hidden="true">DC/OS Authentication (OAuth)</a></h3>

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

<h3><a id="dcos-component-package-manager-pkgpanda" href="#dcos-component-package-manager-pkgpanda" aria-hidden="true">DC/OS Component Package Manager (Pkgpanda)</a></h3>

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

<h3><a id="dcos-diagnostics-3dt" href="#dcos-diagnostics-3dt" aria-hidden="true">DC/OS Diagnostics (3DT)</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/system/health/v1</code><br/>
      Backend: <code>http://127.0.0.1:1050</code>
    </td>
  </tr>
</table>

<h3><a id="dcos-history" href="#dcos-history" aria-hidden="true">DC/OS History</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/dcos-history-service/</code><br/>
      Backend: <code>http://leader.mesos:15055/</code>
    </td>
  </tr>
</table>

<h3><a id="dcos-log" href="#dcos-log" aria-hidden="true">DC/OS Log</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/system/v1/logs/v1/</code><br/>
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/dcos-log.sock</code>
    </td>
  </tr>
</table>

<h3><a id="dcos-metrics" href="#dcos-metrics" aria-hidden="true">DC/OS Metrics</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/system/v1/metrics/</code><br/>
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/dcos-metrics-master.sock</code>
    </td>
  </tr>
</table>

<h3><a id="dcos-package-manager-cosmos" href="#dcos-package-manager-cosmos" aria-hidden="true">DC/OS Package Manager (Cosmos)</a></h3>

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

<h3><a id="exhibitor-zookeeper" href="#exhibitor-zookeeper" aria-hidden="true">Exhibitor (Zookeeper)</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/exhibitor</code><br/>
      Redirect: <code>/exhibitor/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/exhibitor/</code><br/>
      Backend: <code>http://127.0.0.1:8181/</code>
    </td>
  </tr>
</table>

<h3><a id="marathon" href="#marathon" aria-hidden="true">Marathon</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/marathon</code><br/>
      Redirect: <code>/marathon/</code><br/>Deprecated: Use <code>/service/marathon/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/marathon/</code><br/>
      Backend: <code>http://master.mesos:8080/</code><br/>Deprecated: Use <code>/service/marathon/</code>
    </td>
  </tr>
</table>

<h3><a id="mesos-dns" href="#mesos-dns" aria-hidden="true">Mesos DNS</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/mesos_dns</code><br/>
      Redirect: <code>/mesos_dns/</code>
    </td>
  </tr>
  <tr>
    <td>
      Path: <code>/mesos_dns/</code><br/>
      Backend: <code>http://master.mesos:8123/</code>
    </td>
  </tr>
</table>

<h3><a id="navstar" href="#navstar" aria-hidden="true">Navstar</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/navstar/lashup/key</code><br/>
      Backend: <code>http://127.0.0.1:62080/lashup/key</code>
    </td>
  </tr>
</table>

<h3><a id="system" href="#system" aria-hidden="true">System</a></h3>

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
