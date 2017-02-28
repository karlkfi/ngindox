# Ngindox

Ngindox generates documentation from NGINX configurations (nginx.conf).

## Usage

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

## Example

Example from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Input: [examples/nginx.master.conf](examples/nginx.master.conf)
- Output: [examples/nginx.master.md](examples/nginx.master.md)
