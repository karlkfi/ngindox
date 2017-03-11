var YAML = require('yamljs'),
	MarkdownIt = require('markdown-it'),
	GithubSlugger = require('github-slugger'),
	indentBlock = require('./indent').indentBlock,
	innertext = require('innertext'),
	singleTrailingNewline = require('single-trailing-newline'),
	pretty = require('pretty');

var DisplayFields = [
	'Redirect',
	'Proxy',
	'File',
	'Socket',
	'Backend',
	'Cache',
	'Deprecated'
]

function Config() {
	this.upstreams = []
	this.locations = []
}

Config.prototype.toHtml = function(formatConfig) {
	formatConfig = formatConfig || {};

	var locations = this.locations;
	var upstreams = this.upstreams;

	processLocations(locations, upstreams);

	var body = "";
	var group = ''
	var headers = [];

	body += '<div id="ngindox">';
	body += '<ul class="resources">';

	for (var i = 0, len = locations.length; i < len; i++) {
		var location = locations[i];

		if (location.metadata.Group != group) {
			group = location.metadata.Group
			var header = new Header("h2", group)
			headers.push(header);
			body += "\n";
			body += `<li id="resource-${header.anchor}" class="resource">\n`;
			body += "\n";
			body += header.resourceHtml() + "\n"
			body += "\n";
			body += `<ul id="routes-${header.anchor}" class="routes" style="display:none;">\n`;
		}

		var type = routeType(location);

		body += `<li class="route route-type-${type.toLowerCase()}">\n`;

		// Route Type/Path/Description
		body += '<div class="heading">\n';
		body += '<h3>\n';
		body += `<span class="route-type">${type}</span>\n`;
		body += `<span class="route-path">${renderHtml(location.metadata.Path)}</span>\n`;
		body += "</h3>\n";
		if (location.metadata.Description) {
			body += `<span class="route-desc">${location.metadata.Description}</span>\n`;
		}
		body += '</div>\n';

		// Route Metadata
		if (hasAtLeastOne(location.metadata, DisplayFields)) {
			body += '<div class="route-meta">\n';
			body += "<table>\n";
			for (var j = 0, jlen = DisplayFields.length; j < jlen; j++) {
				var field = DisplayFields[j];
				if (location.metadata[field]) {
					body += "<tr>\n";
					body += "<td>\n";
					body += field + ":\n";
					body += "</td>\n";
					body += "<td>\n";
					body += renderHtml(location.metadata[field]) + "\n";
					body += "</td>\n";
					body += "</tr>\n";
				}
			}
			body += "</table>\n";
			body += "</div>\n";
		}

		body += "</li>\n";

		if (i+1 == len || locations[i+1].metadata.Group != group) {
			body += "</ul>\n";
			body += "</li>\n";
		}
	}

	body += '</ul>';
	body += '</div>';

	var prefix = "";

	if (formatConfig.css) {
		prefix += "<style>\n";
		prefix += singleTrailingNewline(indentBlock(formatConfig.css, "  "));
		prefix += "</style>\n";
		prefix += "\n";
	}

	if (formatConfig.javascript) {
		prefix += '<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>\n'

		prefix += "<script>\n";
		prefix += singleTrailingNewline(indentBlock(formatConfig.javascript, "  "));
		prefix += "</script>\n";
		prefix += "\n";
	}

	if (formatConfig.title) {
		prefix += (new Header("h1", formatConfig.title)).titleHtml() + "\n"
		prefix += "\n";
	}

	return pretty(prefix + body);
}

function processLocations(locations, upstreams) {

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
				var upstream = match[0];
				location.metadata.Backend = upstream.name;
				if (upstream.metadata.Name) {
					location.metadata.Backend = upstream.metadata.Name;
				}
				if (upstream.metadata.Reference) {
					// Turn Server into a reference link
					location.metadata.Backend = "[" + location.metadata.Backend + "](" + upstream.metadata.Reference + ")";
				}

				var proxy = match[1];
				location.metadata.Proxy = "`" + proxy + "`";
				if (match.length > 2) {
					location.metadata.Socket = "`" + match[2] + "`";
				}
			} else {
				location.metadata.Proxy = "`" + location.proxyPass + "`";
			}
		}

		if (location.alias) {
			location.metadata.File = "`" + location.alias + "`";
		}

		if (location.path) {
			location.metadata.Path = "`" + location.path + "`";
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
}

function routeType(location) {
	var types = ['Redirect', 'Proxy', 'File'];
	for (var i = 0, len = types.length; i < len; i++) {
		var type = types[i];
		if (location.metadata[type]) {
			return type;
		}
	}
	return 'Unknown';
}

function hasAtLeastOne(map, fields) {
	for (var i = 0, len = fields.length; i < len; i++) {
		var field = fields[i];
		if (map[field]) {
			return true;
		}
	}
	return false;
}

function Header(headerTag, headerText) {
	this.headerTag = headerTag;
	var slugger = new GithubSlugger();
	var md = new MarkdownIt({
		html: false
	});
	this.content = md.renderInline(headerText);
	this.anchor = slugger.slug(
		innertext(this.content)
			.replace(/[<>]/g, '') // In case the heading contains `<stuff>`
			.toLowerCase() // because `slug` doesn't lowercase
	)
}

Header.prototype.resourceHtml = function() {
    var heading = '';
    heading += '<div class="heading">\n';
    heading += `<${this.headerTag}><a id="${this.anchor}" href="#${this.anchor}" aria-hidden="true" class="toggleEndpointList" data-id="${this.anchor}">${this.content}</a></${this.headerTag}>\n`;
    heading += '<span class="options">';
    heading += `<a href="#${this.anchor}" class="toggleEndpointList" data-id="${this.anchor}">Show/Hide</a>`;
    heading += '</span>\n';
    heading += '</div>';
	return heading
}

Header.prototype.titleHtml = function() {
	return `<${this.headerTag}><a id="${this.anchor}" href="#${this.anchor}" aria-hidden="true">${this.content}</a></${this.headerTag}>`;
}

// Find the Upstream that matches a Location's ProxyPass
// and merge the ProxyPass with the Upstream Server into a "Proxy".
// Returns [upstream, proxy] if found.
// Returns [upstream, proxy, socket] if found and server is a unix socket.
// Returns null if not found.
function findUpstream(upstreams, proxyPass) {
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		var matches = proxyPass.match("^(https?://)" + upstream.name + "(.*)$");
		if (matches) {
			var scheme = matches[1];
			var path = matches[2];
			var proxy = scheme + upstream.server + path;

			matches = upstream.server.match("^unix:(.*)$");
			if (matches) {
				proxy = scheme + '<socket>' + path;
				var socket = matches[1];
				return [
					upstream,
					proxy,
					socket
				]
			}

			return [
				upstream,
				proxy
			]
		}
	}
	return null
}

function renderHtml(markdown) {
	var md = new MarkdownIt({
		html: false
	});
	return md.renderInline(markdown);
}

function Upstream(name, server, metadata) {
	this.name = name || '';
	this.server = server || '';
	this.metadata = metadata || {};
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
