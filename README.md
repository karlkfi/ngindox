# Ngindox

Ngindox generates documentation from NGINX configurations (nginx.conf).

## Usage

```
$ npm install
$ npm run -s ngindox < examples/nginx.master.conf
## Upstreams

| Name | Server |
|------|--------|
| `mesos` | `leader.mesos:5050` |  Component: Apache Mesos |

## Locations

| Path | ProxyPass |
|------|--------|
| `/mesos` |   |  Redirect: /mesos/ |
| `/mesos/` | `http://mesos/` |  Component: Apache Mesos Master (Leader) |
```

## Example

Example from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Input: [examples/nginx.master.conf](examples/nginx.master.conf)
- Output: [examples/nginx.master.md](examples/nginx.master.md)
