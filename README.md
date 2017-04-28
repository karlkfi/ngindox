![Ngindox](/ngindox-logo-header.png)

1. Parse NGINX configurations
2. Generate HTML documentation
3. Profit!


## Install

From npm:

```
npm install -g ngindox
```

From docker: no install required. See [karlkfi/ngindox on DockerHub](https://hub.docker.com/r/karlkfi/ngindox/).

From source:

```
git clone https://github.com/karlkfi/ngindox
cd ngindox
npm install -g
```


## Options

```
$ ngindox --help
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
ngindox parse -f examples/nginx.master.conf > examples/nginx.master.yaml
```

Ngindox pays close attention to three commands in NGINX configs:

- `upstream`
- `location`
- `root`

These commands are parsed for their content, but may also be commented to annotate metadata that will be included in the Ngindox YAML and rendered in the Ngindox UI. For example:

```
# Group: Root
# Description: Static web content
root /path/to/html/files;
```

All comments immediately prior to parsed commands are assumed to be Ngindox metadata in YAML format, unless prefixed with an additional `#`. For example:

```
## This comment is freeform and ignored by Ngindox
# Group: Root
# Description: Static web content
root /path/to/html/files;
```

Another option for ignoring non-metadata is to use a YAML file delimiter (`---`) to prefix the metadata. For example:

```
# This comment is freeform and ignored by Ngindox
# ---
# Group: Root
# Description: Static web content
root /path/to/html/files;
```

### UI

The `ui` command reads in an Ngindox YAML and writes out Ngindox UI HTML to STDOUT.

```
ngindox ui -f examples/nginx.master.yaml > examples/nginx.master.html
```

By default, the HTML output embeds `<style>` and `<script>` sections, including [jquery](https://jquery.com/).

Disable css and/or javascript by passing an empty string value to the respective option flags:

```
ngindox ui --css '' --javascript '' -f examples/nginx.agent.yaml > examples/nginx.agent.html
```

### Piping

If no file is specified, input is expected on STDIN. This allows piping the intermediate Ngindox YAML without saving it to disk:

```
ngindox parse -f examples/nginx.agent.conf | ./cli.js ui > examples/nginx.agent.html
```

Note: Using STDIN for parsing disables file include expansion.


## Examples

Examples from [DC/OS](https://dcos.io)'s [Admin Router](https://github.com/dcos/adminrouter):

- Master Config
  - From npm:
    ```
    ngindox parse -f examples/nginx.master.conf > examples/nginx.master.yaml
    ngindox ui -f examples/nginx.master.yaml > examples/nginx.master.html
    ```
  - From docker:
    ```
    docker run --rm -v "$PWD/examples:/examples" karlkfi/ngindox parse -f /examples/nginx.master.conf > examples/nginx.master.yaml
    docker run --rm -v "$PWD/examples:/examples" karlkfi/ngindox ui -f /examples/nginx.master.yaml > examples/nginx.master.html
    ```
  - From source:
    ```
    bin/cli.js parse -f examples/nginx.master.conf > examples/nginx.master.yaml
    bin/cli.js ui -f examples/nginx.master.yaml > examples/nginx.master.html
    ```
  - NGINX: [examples/nginx.master.conf](examples/nginx.master.conf)
  - YAML: [examples/nginx.master.yaml](examples/nginx.master.yaml)
  - HMTL: [examples/nginx.master.html](examples/nginx.master.html)
  - Rendered: <https://rawgit.com/karlkfi/ngindox/master/examples/nginx.master.html>
- Agent Config
  - From npm:
    ```
    ngindox parse -f examples/nginx.agent.conf > examples/nginx.agent.yaml
    ngindox ui -f examples/nginx.agent.yaml > examples/nginx.agent.html
    ```
  - From docker:
    ```
    docker run --rm -v "$PWD/examples:/examples" karlkfi/ngindox parse -f /examples/nginx.agent.conf > examples/nginx.agent.yaml
    docker run --rm -v "$PWD/examples:/examples" karlkfi/ngindox ui -f /examples/nginx.agent.yaml > examples/nginx.agent.html
    ```
  - From source:
    ```
    bin/cli.js parse -f examples/nginx.agent.conf > examples/nginx.agent.yaml
    bin/cli.js ui -f examples/nginx.agent.yaml > examples/nginx.agent.html
    ```
  - NGINX: [examples/nginx.agent.conf](examples/nginx.agent.conf)
  - YAML: [examples/nginx.agent.yaml](examples/nginx.agent.yaml)
  - HMTL: [examples/nginx.agent.html](examples/nginx.agent.html)
  - Rendered: <https://rawgit.com/karlkfi/ngindox/master/examples/nginx.agent.html>


## License

Copyright 2017 Karl Isenberg

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this repository except in compliance with the License.

The contents of this repository are solely licensed under the terms described in the [LICENSE file](/LICENSE) included in this repository.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
