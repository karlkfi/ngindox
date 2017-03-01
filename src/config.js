var YAML = require('yamljs');

function Config() {
	this.upstreams = []
	this.locations = []
}

Config.prototype.toMarkdown = function() {
	var out = "";

	out += "## Locations\n\n";

	var locations = this.locations;

	// modify the path prior to sorting
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

	var group = ''

	for (var i = 0, len = locations.length; i < len; i++) {
		var location = locations[i];

		if ((location.metadata.Group || 'Other') != group) {
			group = location.metadata.Group || 'Other'
			out += "\n### " + group + "\n\n"
			out += "|   |\n";
			out += "|---|\n";
		}

		out += "| ";
		out += "Path: `" + location.path + "`";
		if (location.proxyPass != '') {
			out += "<br/>ProxyPass: `" + location.proxyPass + "`";
		}
		if (location.metadata) {
			out += "<br/>" + toHTML(location.metadata);
		}
		out += " |\n";
	}


	out += "\n\n## Upstreams\n\n";
	// ignore groups in upstreams, just list alphabetically for easy lookup
	out += "|   |\n";
	out += "|---|\n";

	var upstreams = this.upstreams;

	upstreams.sort(function(a, b) {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	var group = '';

	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];

		out += "| ";
		out += "Name: `" + upstream.name + "`";;
		out += "<br/>Server: `" + upstream.server + "`";;
		if (upstream.metadata) {
			out += "<br/>" + toHTML(upstream.metadata);
		}
		out += " |\n";
	}

	return out.replace(/\n$/, '');
}

function toHTML(metadata) {
	var lines = []
	// Group is shown by headers
//	if (metadata.Group) {
//		lines.push("Group: " + metadata.Group)
//	}
	if (metadata.Name) {
		lines.push("Name: " + metadata.Component)
	}
	if (metadata.Description) {
		lines.push("Description: " + metadata.Component)
	}
	if (metadata.Component) {
		lines.push("Component: " + metadata.Component)
	}
	if (metadata.Proxy) {
		lines.push("Proxy: " + metadata.Proxy)
	}
	if (metadata.Redirect) {
		lines.push("Redirect: " + metadata.Redirect)
	}
	if (metadata.Cache) {
		lines.push("Cache: " + metadata.Proxy)
	}
	if (metadata.Deprecated) {
		lines.push("Deprecated: " + metadata.Deprecated)
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
