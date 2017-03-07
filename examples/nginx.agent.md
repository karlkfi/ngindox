## Locations


### DC/OS Component Package Manager (Pkgpanda)

<table>
  <tr>
    <td>
      Path: `/pkgpanda/`<br/>
      Backend: `http://<socket>/`<br/>
      Socket: `/run/dcos/pkgpanda-api.sock`
    </td>
  </tr>
</table>

### DC/OS Diagnostics (3DT)

<table>
  <tr>
    <td>
      Path: `/system/health/v1`<br/>
      Backend: `http://<socket>`<br/>
      Socket: `/run/dcos/3dt.sock`
    </td>
  </tr>
</table>

### DC/OS Log

<table>
  <tr>
    <td>
      Path: `/system/v1/logs/v1/`<br/>
      Backend: `http://<socket>/`<br/>
      Socket: `/run/dcos/dcos-log.sock`
    </td>
  </tr>
</table>

### DC/OS Metrics

<table>
  <tr>
    <td>
      Path: `/system/v1/metrics/`<br/>
      Backend: `http://<socket>/`<br/>
      Socket: `/run/dcos/dcos-metrics-agent.sock`
    </td>
  </tr>
</table>
