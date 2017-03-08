# Ngindox

Ngindox generates HTML documentation from NGINX configurations (nginx.conf).


## Install

```
git clone https://github.com/karlkfi/ngindox/
npm install
```


## Options

```
./cli.js --help
Usage:
  cli.js [OPTIONS] [ARGS]

Options:
  -f, --file FILE        Path to NGINX config file to parse
  -e, --encoding [STRING]File encoding (Default is utf8)
  -t, --title [STRING]   Page title (Default is Locations)
  -l, --toc BOOLEAN      Table of contents
  -h, --help             Display help and usage details
```


## Usage

```
./cli.js -l -f examples/nginx.master.conf
<ul>
  <li><a href="#admin-router">Admin Router</a></li>
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
```


## Examples

Examples from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Master Config
  - `./cli.js -l -f examples/nginx.master.conf > examples/nginx.master.md`
  - Input: [examples/nginx.master.conf](examples/nginx.master.conf)
  - Output: [examples/nginx.master.md](examples/nginx.master.md)
- Agent Config
  - `./cli.js -l -f examples/nginx.agent.conf > examples/nginx.agent.md`
  - Input: [examples/nginx.agent.conf](examples/nginx.agent.conf)
  - Output: [examples/nginx.agent.md](examples/nginx.agent.md)
