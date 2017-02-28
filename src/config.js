
function Config() {
	this.upstreams = []
	this.locations = []
}

Config.prototype.toMarkdown = function() {
	var out = "";

	out += "## Upstreams\n\n";
	out += "| Name | Server |\n";
	out += "|------|--------|\n";

	var upstreams = this.upstreams;
	// TODO: sort upstreams
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		out += "| `" + upstream.name + "` | `" + upstream.server + "` |\n";
	}


    out += "\n## Locations\n\n";
    out += "| Path | ProxyPass |\n";
    out += "|------|--------|\n";

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

    	if (location.proxyPass == '') {
    		out += "| `" + path + "` |   |\n";
    	} else {
    		out += "| `" + path + "` | `" + location.proxyPass + "` |\n";
    	}
    }

    return out;
}

function Upstream(name, server) {
	this.name = name || ''
	this.server = server || ''
}

function Location(path, proxyPass) {
	this.path = path || '';
    this.proxyPass = proxyPass || '';
}

exports.Config = Config;
exports.Upstream = Upstream;
exports.Location = Location;
