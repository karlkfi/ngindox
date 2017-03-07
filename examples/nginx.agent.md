## Locations


### DC/OS Component Package Manager (Pkgpanda)

<table>
  <tr>
    <td>
      Path: <code>/pkgpanda/</code><br/>
      Backend: <code>http://<socket>/</code><br/>Socket: <code>/run/dcos/pkgpanda-api.sock</code>
    </td>
  </tr>
</table>

### DC/OS Diagnostics (3DT)

<table>
  <tr>
    <td>
      Path: <code>/system/health/v1</code><br/>
      Backend: <code>http://<socket></code><br/>Socket: <code>/run/dcos/3dt.sock</code>
    </td>
  </tr>
</table>

### DC/OS Log

<table>
  <tr>
    <td>
      Path: <code>/system/v1/logs/v1/</code><br/>
      Backend: <code>http://<socket>/</code><br/>Socket: <code>/run/dcos/dcos-log.sock</code>
    </td>
  </tr>
</table>

### DC/OS Metrics

<table>
  <tr>
    <td>
      Path: <code>/system/v1/metrics/</code><br/>
      Backend: <code>http://<socket>/</code><br/>Socket: <code>/run/dcos/dcos-metrics-agent.sock</code>
    </td>
  </tr>
</table>
