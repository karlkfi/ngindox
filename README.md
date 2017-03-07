# Ngindox

Ngindox generates documentation from NGINX configurations (nginx.conf).

## Usage

```
$ npm install
./cli.js -f examples/nginx.master.conf
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
```

## Examples

Examples from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Master Config
  - Input: [examples/nginx.master.conf](examples/nginx.master.conf)
  - Output: [examples/nginx.master.md](examples/nginx.master.md)
- Agent Config
  - Input: [examples/nginx.agent.conf](examples/nginx.agent.conf)
  - Output: [examples/nginx.agent.md](examples/nginx.agent.md)
