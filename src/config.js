var YAML = require('yamljs'),
	MarkdownIt = require('markdown-it'),
	GithubSlugger = require('github-slugger'),
	indentBlock = require('./indent').indentBlock,
	innertext = require('innertext'),
	singleTrailingNewline = require('single-trailing-newline'),
	removeTrailingSpaces = require("remove-trailing-spaces"),
	pretty = require('pretty'),
	camelCase = require('camelcase');

var DisplayFields = [
	'Redirect',
	'Rewrite',
	'Proxy',
	'File',
	'Lua',
	'Socket',
	'Backend',
	'Cache',
	'Deprecated'
]

var RouteTypeDescription = {
	'Proxy': 'retrieves resources from another address.',
	'File': 'retrieves static files.',
	'Lua': 'executes Lua code to generate response.',
	'Redirect': 'redirects to another address.',
	'Rewrite': 'retrieves resources from another route.',
	'Unknown': 'unrecognized routing mechanism.',
}

var TypeFields =[
	'Proxy',
	'File',
	'Lua',
	'Redirect',
	'Rewrite',
	'Unknown'
]

function Config() {
	this.upstreams = [];
	this.locations = [];
	this.root = null;
}

Config.prototype.toHtml = function(formatConfig) {
	formatConfig = formatConfig || {};

	var locations = this.locations;
	var upstreams = this.upstreams;
	var root = this.root;

	processLocations(locations, upstreams, root);

	var body = "";
	var group = ''
	var headers = [];

	body += '<ul class="resources">\n';

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
			body += `<ul id="routes-${header.anchor}" class="routes">\n`;
		}

		var type = location.routeType();

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
			body += '<div class="route-meta" style="display:none">\n';
			body += "<table>\n";
			for (var j = 0, jlen = DisplayFields.length; j < jlen; j++) {
				var field = DisplayFields[j];
				var value = location.metadata[field];
				// any metadata field value may be an array (ex: Rewrite, Redirect)
				var entries = [];
				if (Array.isArray(value)) {
					entries = value;
				} else if (value) {
					entries.push(value);
				}
				for (var k = 0, klen = entries.length; k < klen; k++) {
					var entry = entries[k];
					body += "<tr>\n";
					body += "<td>\n";
					body += field + ":\n";
					body += "</td>\n";
					body += "<td>\n";
					body += renderHtml(entry) + "\n";
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

	var prefix = "";

	if (formatConfig.css) {
		prefix += "<style>\n";
		prefix += singleTrailingNewline(indentBlock(formatConfig.css, "  "));
		prefix += "</style>\n";
		prefix += "\n";
	}

	if (formatConfig.javascript) {
		prefix += '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.0/jquery.min.js" integrity="sha256-JAW99MJVpJBGcbzEuXk4Az05s/XyDdBomFqNlM3ic+I=" crossorigin="anonymous"></script>\n'

		prefix += "<script>\n";
		prefix += singleTrailingNewline(indentBlock(formatConfig.javascript, "  "));
		prefix += "</script>\n";
		prefix += "\n";
	}

	if (formatConfig.title) {
		prefix += (new Header("h1", formatConfig.title)).titleHtml() + "\n"
		prefix += "\n";
	}

	if (formatConfig.legend || true) {
		var legend = '';
		legend += '<div class="legend">';

		legend += '<div class="heading">';
		legend += (new Header("h2", "Legend")).legendHtml() + "\n"
		legend += '</div>';
		legend += '<ul>\n';

		// only show the types used by this set of locations
		var types = routeTypes(locations);

		for (var i = 0, len = types.length; i < len; i++) {
			var type = types[i];
			legend += `<li class="route route-type-${type.toLowerCase()}">`;
			legend += `<input type="checkbox" data-type="${type.toLowerCase()}" checked="checked">`;
			legend += '<label class="heading">';
			legend += `<span class="route-type toggle-route-type">${type}</span>`;
			legend += `<span class="route-desc">${RouteTypeDescription[type]}</span>`;
			legend += '</label>';
			legend += '</input>';
			legend += '</li>\n';
		}

		legend += '</ul>\n';
		legend += '</div>\n';

		// legend above the body
		body = legend + body;
	}

	// wrap body with a unique ID for namespacing
	return singleTrailingNewline(
		removeTrailingSpaces(
			pretty(
				'<div id="ngindox">\n' + prefix + body + '</div>\n'
			)
		)
	);
}

function processLocations(locations, upstreams, root) {

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

	if (root) {
		locations.push(root);
	}

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
			var match = findUpstream(upstreams, location)
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

		if (location.lua) {
			location.metadata.Lua = "```" + location.lua + "```";
		}

		if (location.luaFile) {
			location.metadata.Lua = "`" + location.luaFile + "`";
		}

		if (location.rewrites) {
			for (var j = 0, jlen = location.rewrites.length; j < jlen; j++) {
				var rewrite = location.rewrites[j];
				if (rewrite.flag == "redirect" || rewrite.flag == "permanent") {
					if (!location.metadata.Redirect) {
						location.metadata.Redirect = [];
					}
					location.metadata.Redirect.push(rewriteMarkdown(rewrite));
				} else {
					if (!location.metadata.Rewrite) {
						location.metadata.Rewrite = [];
					}
					location.metadata.Rewrite.push(rewriteMarkdown(rewrite));
				}
			}
		}

		if (!location.metadata.Group) {
			location.metadata.Group = 'Other';
		}
	}

	// exclude root from sorting
	if (root) {
		root = locations.pop();
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

	// put root at the top
	if (root) {
		locations.unshift(root);
	}
}

function rewriteMarkdown(rewrite) {
	var markdown = "Regex: `" + rewrite.regex + "`<br/>";
	markdown += "Replacement: `" + rewrite.replacement + "`<br/>";
	markdown += "Flag: `" + rewrite.flag + "`";
	return markdown;
}

// Get a list of route types found in the provided locations
function routeTypes(locations) {
	var typeSet = {};
	for (var i = 0, len = locations.length; i < len; i++) {
		var location = locations[i];
		var type = location.routeType();
		typeSet[type] = true;
	}
	// Use TypeFields ordering
	var typeList = [];
	for (var i = 0, len = TypeFields.length; i < len; i++) {
		var type = TypeFields[i];
		if (typeSet[type]) {
			typeList.push(type)
		}
	}
	return typeList;
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
		html: true
	});
	this.content = md.renderInline(headerText);
	this.anchor = slugger.slug(
		innertext(this.content)
			.replace(/[<>]/g, '') // In case the heading contains `<stuff>`
			.toLowerCase() // because `slug` doesn't lowercase
	)
}

Header.prototype.titleHtml = function() {
	var heading = '';
	heading += '<div class="heading">\n';
	heading += `<${this.headerTag}><a id="${this.anchor}" href="#${this.anchor}" aria-hidden="true" class="toggle-route-group" data-id="${this.anchor}">${this.content}</a></${this.headerTag}>\n`;
	heading += '<span class="options">';
	heading += `<a href="#${this.anchor}" class="toggle-route-groups" data-state="visible">Show/Hide All</a>`;
	heading += '</span>\n';
	heading += '</div>';
	return heading
}

Header.prototype.legendHtml = function() {
	var heading = '';
	heading += '<div class="heading">\n';
	heading += `<${this.headerTag}><a id="${this.anchor}" href="#${this.anchor}" aria-hidden="true" class="toggle-route-group" data-id="${this.anchor}">${this.content}</a></${this.headerTag}>\n`;
	heading += '</div>';
	return heading
}

Header.prototype.resourceHtml = function() {
	var heading = '';
	heading += '<div class="heading">\n';
	heading += `<${this.headerTag}><a id="${this.anchor}" href="#${this.anchor}" aria-hidden="true" class="toggle-route-group" data-id="${this.anchor}"><div class="arrow arrow-right"></div>${this.content}</a></${this.headerTag}>\n`;
	heading += '<span class="options">';
	heading += `<a href="#${this.anchor}" class="toggle-route-group" data-id="${this.anchor}">Show/Hide</a>`;
	heading += '</span>\n';
	heading += '</div>';
	return heading
}

// Find the Upstream that matches a Location's ProxyPass
// and merge the ProxyPass with the Upstream Server into a "Proxy".
// Returns [upstream, proxy] if found.
// Returns [upstream, proxy, socket] if found and server is a unix socket.
// Returns null if not found.
function findUpstream(upstreams, location) {
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		var matches = location.proxyPass.match("^(https?://)" + upstream.name + "(.*)$");
		if (matches) {
			var scheme = matches[1];
			var path = matches[2];
			var proxy = scheme + upstream.server + path;
			if (!path) {
				// pass location path to upstream server
				// TODO: indicate that path is pre-processed/unescaped?
				// TODO: what if path is regex? doesn't start with slash?
				// TODO: handle the path being processed by rewrites?
				proxy += location.path;
			}

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
		html: true
	});
	return md.renderInline(markdown);
}

function Upstream(name, server, metadata) {
	this.name = name || '';
	this.server = server || '';
	this.metadata = metadata || {};
}

function Location(path, metadata) {
	this.path = path || '';
	this.metadata = metadata || {};
	this.proxyPass = '';
	this.alias = '';
	this.rewrites = [];
	this.lua = '';
	this.luaFile = '';
}

Location.prototype.routeType = function() {
	for (var i = 0, len = TypeFields.length; i < len; i++) {
		var type = TypeFields[i];
		if (this.metadata[type]) {
			return type;
		}
	}
	return 'Unknown';
}

function Rewrite(regex, replacement, flag) {
	this.regex = regex || '';
	this.replacement = replacement || '';
	this.flag = flag || '';
}

exports.Config = Config;
exports.Upstream = Upstream;
exports.Location = Location;
exports.Rewrite = Rewrite;
