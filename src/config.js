var YAML = require('yamljs');

function Config() {
	this.upstreams = []
	this.locations = []
}

Config.prototype.toMarkdown = function() {
	var locations = this.locations;
	var upstreams = this.upstreams;

	// sort upstreams by name (backwards)
	// allows longer names to be matched first using findUpstream
	// ex: mesos_dns & mesos
	upstreams.sort(function(a, b) {
		if (a.name > b.name) {
			return -1;
		}
		if (a.name < b.name) {
			return 1;
		}
		return 0;
	});

	// process fields prior to sorting
	for (var i = 0, len = locations.length; i < len; i++) {
		var location = locations[i];

		var path = location.path;
		var pathArgs = path.split(' ');
		if (pathArgs.length > 1) {
			if (pathArgs[0] == "=") {
				// exact matcher
				path = pathArgs[1]
			} else if (pathArgs[0] == "~") {
				// regex matcher
				path = pathArgs[1]
				if (path.startsWith("^")) {
					path = path.substr(1);
				}
				if (path.endsWith("$")) {
					path = path.substr(0, path.length-1);
				}
			}
		}
		location.path = path;

		if (location.proxyPass) {
			var match = findUpstream(upstreams, location.proxyPass)
			if (match) {
				location.metadata.Backend = "<code>" + match[1] + "</code>";
				if (match.length > 2) {
					location.metadata.Socket = "<code>" + match[2] + "</code>";
				}
			} else {
				location.metadata.Backend = "<code>" + location.proxyPass + "</code>";
			}
		}

		if (location.alias) {
			location.metadata.File = "<code>" + location.alias + "</code>";
		}

		if (location.path) {
			location.metadata.Path = "<code>" + location.path + "</code>";
		}

		if (!location.metadata.Group) {
			location.metadata.Group = 'Other';
		}
	}

	locations.sort(function(a, b) {
		if (a.metadata.Group < b.metadata.Group) {
			return -1;
		}
		if (a.metadata.Group > b.metadata.Group) {
			return 1;
		}
		if (a.path < b.path) {
			return -1;
		}
		if (a.path > b.path) {
			return 1;
		}
		return 0;
	});

	var out = "";
	out += "## Locations\n\n";

	var group = ''

	for (var i = 0, len = locations.length; i < len; i++) {
		var location = locations[i];

		if (location.metadata.Group != group) {
			group = location.metadata.Group
			out += "\n### " + group + "\n\n"
			out += "<table>\n";
		}

		out += "  <tr>\n";
		out += "    <td>\n";
		out += "      " + toHTML(location.metadata).replace("<br/>", "<br/>\n      ") + "\n";
		out += "    </td>\n";
		out += "  </tr>\n";

		if (i+1 == len || locations[i+1].metadata.Group != group) {
			out += "</table>\n";
		}
	}

	return out;
}

// Find the Upstream that matches a Location's ProxyPass
// and merge the ProxyPass with the Upstream Server into a "Backend".
// Returns [upstream, backend] if found.
// Returns [upstream, backend, socket] if found and server is a unix socket.
// Returns null if not found.
function findUpstream(upstreams, proxyPass) {
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		var matches = proxyPass.match("^(https?://)" + upstream.name + "(.*)$");
		if (matches) {
			var scheme = matches[1];
			var path = matches[2];
			var backend = scheme + upstream.server + path;

			matches = upstream.server.match("^unix:(.*)$");
			if (matches) {
				backend = scheme + '<socket>' + path;
				var socket = matches[1];
				return [
					upstream,
					backend,
					socket
				]
			}

			return [
				upstream,
				backend
			]
		}
	}
	return null
}

function toHTML(metadata) {
	var fields = [
		'Path',
		'Redirect',
		'File',
		'Backend',
		'Socket',
		'Cache',
		'Deprecated',
		'Description',
	]
	var lines = []
	for (var i = 0, len = fields.length; i < len; i++) {
		var field = fields[i];
		if (metadata[field]) {
			lines.push(field + ": " + metadata[field])
		}
	}
	return lines.join("<br/>");
}

function Upstream(name, server, metadata) {
	this.name = name || '';
	this.server = server || '';
	this.metadata = metadata || YAML.parse('');
}

function Location(path, proxyPass, alias, metadata) {
	this.path = path || '';
	this.proxyPass = proxyPass || '';
	this.alias = alias || '';
	this.metadata = metadata || {};
}

exports.Config = Config;
exports.Upstream = Upstream;
exports.Location = Location;
