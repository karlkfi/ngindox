
function Config() {
	this.upstreams = []
	this.locations = []
}

Config.prototype.toMarkdown = function() {
	var out = "";

	out += "## Upstreams\n\n";
//	out += "| Name | Server | Description |\n";
//	out += "|------|--------|-------------|\n";
	out += "| Upstreams |\n";
	out += "|-----------|\n";

	var upstreams = this.upstreams;
	// TODO: sort upstreams
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		out += "| ";
		out += "Name: " + upstream.name;
		out += "<br/>Server: " + upstream.server;
		if (upstream.description != '') {
			out += "<br/>" + upstream.description.trim();
		}
		out += " |\n";
	}


	out += "\n## Locations\n\n";
//	out += "| Path | ProxyPass | Description |\n";
//	out += "|------|-----------|-------------|\n";
	out += "| Locations |\n";
	out += "|-----------|\n";

	var locations = this.locations;
	// TODO: sort locations
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
		
		out += "| ";
		out += "Path: " +path;
		if (location.proxyPass != '') {
			out += "<br/>ProxyPass: " + location.proxyPass;
		}
		if (location.description != '') {
			out += "<br/>" + location.description.trim();
		}
		out += " |\n";
		
	}

	return out;
}

function Upstream(name, server, description) {
	this.name = name || '';
	this.server = server || '';
	this.description = description || '';
}

function Location(path, proxyPass, description) {
	this.path = path || '';
	this.proxyPass = proxyPass || '';
	this.description = description || '';
}

exports.Config = Config;
exports.Upstream = Upstream;
exports.Location = Location;
