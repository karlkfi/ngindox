<ul>
  <li><a href="#dcos-component-package-manager-pkgpanda">DC/OS Component Package Manager (Pkgpanda)</a></li>
  <li><a href="#dcos-diagnostics-3dt">DC/OS Diagnostics (3DT)</a></li>
  <li><a href="#dcos-log">DC/OS Log</a></li>
  <li><a href="#dcos-metrics">DC/OS Metrics</a></li>
</ul>


<h3><a id="dcos-component-package-manager-pkgpanda" href="#dcos-component-package-manager-pkgpanda" aria-hidden="true">DC/OS Component Package Manager (Pkgpanda)</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/pkgpanda/</code><br/>
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/pkgpanda-api.sock</code>
    </td>
  </tr>
</table>

<h3><a id="dcos-diagnostics-3dt" href="#dcos-diagnostics-3dt" aria-hidden="true">DC/OS Diagnostics (3DT)</a></h3>

<table>
  <tr>
    <td>
      Path: <code>/system/health/v1</code><br/>
      Backend: <code>http://&lt;socket&gt;</code><br/>Socket: <code>/run/dcos/3dt.sock</code>
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
      Backend: <code>http://&lt;socket&gt;/</code><br/>Socket: <code>/run/dcos/dcos-metrics-agent.sock</code>
    </td>
  </tr>
</table>
