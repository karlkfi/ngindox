# Ngindox

Ngindox generates HTML documentation from NGINX configurations (nginx.conf).


## Install

```
git clone https://github.com/karlkfi/ngindox/
npm install
```


## Options

```
$ ./cli.js --help
Usage:
  cli.js [OPTIONS] [ARGS]

Options:
  -f, --file FILE        Path to NGINX config file to parse
  -c, --css [FILE]       Path to CSS file to include (Default is include/ngindox.css)
  -j, --javascript [FILE]Path to JS file to include (Default is include/ngindox.js)
  -e, --encoding [STRING]File encoding (Default is utf8)
  -t, --title STRING     Page title
  -h, --help             Display help and usage details
```


## Usage

The CLI requires a file path to an nginx config and prints HTML to stdout.

```
$ ./cli.js -f examples/nginx.master.conf > examples/nginx.master.html
```

By default, the HTML output includes `<style>` and `<script>` sections, including [jquery](https://jquery.com/).

Disable css and/or javascript by passing an empty string value to the respective option flags:

```
./cli.js --css '' --javascript '' -f examples/nginx.agent.conf > examples/nginx.agent.html
```


## Examples

Examples from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Master Config
  - `./cli.js -f examples/nginx.master.conf > examples/nginx.master.html`
  - Input: [examples/nginx.master.conf](examples/nginx.master.conf)
  - Output: [examples/nginx.master.md](examples/nginx.master.html)
  - Rendered: <https://rawgit.com/karlkfi/ngindox/master/examples/nginx.master.html>
- Agent Config
  - `./cli.js -f examples/nginx.agent.conf > examples/nginx.agent.html`
  - Input: [examples/nginx.agent.conf](examples/nginx.agent.conf)
  - Output: [examples/nginx.agent.md](examples/nginx.agent.html)
  - Rendered: <https://rawgit.com/karlkfi/ngindox/master/examples/nginx.agent.html>
