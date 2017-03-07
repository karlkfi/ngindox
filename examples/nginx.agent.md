## Locations


### DC/OS Component Package Manager (Pkgpanda)

<table>
  <tr>
    <td>
      Path: <pre><code>/pkgpanda/</code></pre><br/>
      Backend: <pre><code>http://<socket>/</code></pre><br/>Socket: <pre><code>/run/dcos/pkgpanda-api.sock</code></pre>
    </td>
  </tr>
</table>

### DC/OS Diagnostics (3DT)

<table>
  <tr>
    <td>
      Path: <pre><code>/system/health/v1</code></pre><br/>
      Backend: <pre><code>http://<socket></code></pre><br/>Socket: <pre><code>/run/dcos/3dt.sock</code></pre>
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
      Backend: <pre><code>http://<socket>/</code></pre><br/>Socket: <pre><code>/run/dcos/dcos-metrics-agent.sock</code></pre>
    </td>
  </tr>
</table>
