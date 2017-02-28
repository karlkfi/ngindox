# Ngindox

Ngindox generates documentation from NGINX configurations (nginx.conf).

# Usage

```
$ npm install
$ npm run -s ngindox < examples/nginx.master.conf
## Upstreams

| Name | Server |
|------|--------|
| `mesos` | `leader.mesos:5050` |

## Locations

| Path | ProxyPass |
|------|--------|
| `/mesos/` | `http://mesos/` |
```
