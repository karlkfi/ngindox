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
  cli.js [OPTIONS] <command> [ARGS]

Options:
  -f, --file FILE        Path to input file
  -e, --encoding [STRING]File encoding (Default is utf8)
  -c, --css [FILE]       Path to CSS file to include (Default is include/ngindox.css)
  -j, --javascript [FILE]Path to JS file to include (Default is include/ngindox.js)
  -t, --title [STRING]   Page title (Default is Routes)
  -l, --legend [BOOLEAN] Route type legend (Default is true)
  -h, --help             Display help and usage details

Commands:
  parse, ui
```


## Usage

There are two CLI commands: `parse` and `ui`.

Both commands can take input by file path (`--file`) or by STDIN.

### Parse

The `parse` command reads in an NGINX config and writes out Ngindox YAML to STDOUT.

```
$ ./cli.js parse -f examples/nginx.master.conf > examples/nginx.master.yaml
```

### UI

The `ui` command reads in an Ngindox YAML and writes out Ngindox UI HTML to STDOUT.

```
$ ./cli.js ui -f examples/nginx.master.yaml > examples/nginx.master.html
```

By default, the HTML output embeds `<style>` and `<script>` sections, including [jquery](https://jquery.com/).

Disable css and/or javascript by passing an empty string value to the respective option flags:

```
./cli.js ui --css '' --javascript '' -f examples/nginx.agent.yaml > examples/nginx.agent.html
```

### Piping

If no file is specified, input is expected on STDIN. This allows piping the intermediate Ngindox YAML without saving it to disk:

```
./cli.js parse -f examples/nginx.agent.conf | ./cli.js ui > examples/nginx.agent.html
```

Note: Using STDIN for parsing disables file include expansion.


## Examples

Examples from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Master Config
  - ```
    ./cli.js parse -f examples/nginx.master.conf > examples/nginx.master.yaml
    ./cli.js ui -f examples/nginx.master.yaml > examples/nginx.master.html
    ```
  - NGINX: [examples/nginx.master.conf](examples/nginx.master.conf)
  - YAML: [examples/nginx.master.yaml](examples/nginx.master.yaml)
  - HMTL: [examples/nginx.master.html](examples/nginx.master.html)
  - Rendered: <https://rawgit.com/karlkfi/ngindox/master/examples/nginx.master.html>
- Agent Config
  - ```
    ./cli.js parse -f examples/nginx.agent.conf > examples/nginx.agent.yaml
    ./cli.js ui -f examples/nginx.agent.yaml > examples/nginx.agent.html
    ```
  - NGINX: [examples/nginx.agent.conf](examples/nginx.agent.conf)
  - YAML: [examples/nginx.agent.yaml](examples/nginx.agent.yaml)
  - HMTL: [examples/nginx.agent.html](examples/nginx.agent.html)
  - Rendered: <https://rawgit.com/karlkfi/ngindox/master/examples/nginx.agent.html>
