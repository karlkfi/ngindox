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
				location.metadata.Backend = "`" + match[1] + "`";
			} else {
				location.metadata.Backend = "`" + location.proxyPass + "`";
			}
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
			out += "|   |\n";
			out += "|---|\n";
		}

		out += "| ";
		out += "Path: `" + location.path + "`";
		if (location.metadata) {
			out += "<br/>" + toHTML(location.metadata);
		}
		out += " |\n";
	}

	return out.replace(/\n$/, '');
}

// Find the Upstream that matches a Location's ProxyPass
// and merge the ProxyPass with the Upstream Server into a "Backend".
// Returns [upstream, backend] if found.
// Returns null if not found.
function findUpstream(upstreams, proxyPass) {
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		var matches = proxyPass.match("^(https?://)" + upstream.name + "(.*)$");
		if (matches) {
			var backend = matches[1] + upstream.server + matches[2]
			return [
				upstream,
				backend
			]
		}
	}
	return null
}

function toHTML(metadata) {
	var lines = []
	if (metadata.Name) {
		lines.push("Name: " + metadata.Name)
	}
	if (metadata.Description) {
		lines.push("Description: " + metadata.Description)
	}
	if (metadata.Redirect) {
		lines.push("Redirect: " + metadata.Redirect)
	}
	if (metadata.Cache) {
		lines.push("Cache: " + metadata.Cache)
	}
	if (metadata.Deprecated) {
		lines.push("Deprecated: " + metadata.Deprecated)
	}
	if (metadata.Backend) {
		lines.push("Backend: " + metadata.Backend)
	}
	return lines.join("<br/>");
}

function Upstream(name, server, metadata) {
	this.name = name || '';
	this.server = server || '';
	this.metadata = metadata || YAML.parse('');
}

function Location(path, proxyPass, metadata) {
	this.path = path || '';
	this.proxyPass = proxyPass || '';
	this.metadata = metadata || YAML.parse('');
}

exports.Config = Config;
exports.Upstream = Upstream;
exports.Location = Location;
