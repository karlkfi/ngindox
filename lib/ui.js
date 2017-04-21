var MarkdownIt = require('markdown-it'),
	GithubSlugger = require('github-slugger'),
	NgindoxUtil = require('./util'),
	innertext = require('innertext'),
	singleTrailingNewline = require('single-trailing-newline'),
	removeTrailingSpaces = require("remove-trailing-spaces"),
	pretty = require('pretty');

var RouteFieldNames = {
	'redirects': 'Redirect',
	'rewrites': 'Rewrite',
	'proxy': 'Proxy',
	'file': 'File',
	'lua': 'Lua',
	'cache': 'Cache',
	'deprecated': 'Deprecated'
}

var RouteTypeNames = {
	'proxy': 'Proxy',
	'file': 'File',
	'lua': 'Lua',
	'redirect': 'Redirect',
	'rewrite': 'Rewrite',
	'unknown': 'Unknown'
}

var RouteTypeDescriptions = {
	'proxy': 'retrieves resources from another address.',
	'file': 'retrieves static files.',
	'lua': 'executes Lua code to generate response.',
	'redirect': 'redirects to another address.',
	'rewrite': 'retrieves resources from another route.',
	'unknown': 'unrecognized routing mechanism.',
}


// HTML Generator for route fields
function Generator(backends) {
	this.backends = backends;
}

Generator.prototype.redirects = function(field) {
	return tableToHtml([
		['Regex:', renderHtml("`" + field.regex + "`")],
        ['Replacement:', renderHtml("`" + field.replacement + "`")],
        ['Type:', renderHtml("`" + field.type + "`")]
	]);
};

Generator.prototype.rewrites = function(field) {
	return tableToHtml([
		['Regex:', renderHtml("`" + field.regex + "`")],
		['Replacement:', renderHtml("`" + field.replacement + "`")],
		['Type:', renderHtml("`" + field.type + "`")]
	]);
};

Generator.prototype.proxy = function(field) {
	var table = [];
	table.push(['Path:', renderHtml("`" + field.path + "`")]);
	if (field.backend) {
		var backend = this.backends[field.backend];
		if (backend) {
			table.push(['Server:', renderHtml("`" + backend.server + "`")]);
			if (backend.name) {
				table.push(['Backend:', backend.name]);
			} else {
				table.push(['Backend:', field.backend]);
			}
			if (backend.reference) {
				table.push(['API Reference:', renderHtml("<" + backend.reference + ">")]);
			}
		} else {
			table.push(['Backend:', field.backend]);
		}
	}
	return tableToHtml(table);
};

Generator.prototype.file = function(field) {
	return tableToHtml([
		['Path:', renderHtml("`" + field + "`")]
	]);
};

Generator.prototype.lua = function(field) {
	var table = [];
	if (field.file) {
		table.push(['Path:', renderHtml("`" + field.file + "`")]);
	} else if (field.inline) {
		table.push(['Inline', '<Code Not Shown>']);
	}
	return tableToHtml(table);
};

Generator.prototype.cache = function(field) {
	return renderHtml(field);
};

Generator.prototype.deprecated = function(field) {
	return renderHtml(field);
};


function toHtml(ngindox, formatConfig) {
	formatConfig = formatConfig || {};

	var backends = ngindox.backends;

	// shallow copy routes - remove routes marked as hidden
	var routes = {};
	var paths = Object.keys(ngindox.routes);
	for (var i = 0, len = paths.length; i < len; i++) {
		var path = paths[i];
		var route = ngindox.routes[path];
		if (route['visibility'] != 'hidden') {
			routes[path] = route;
		}
	}

	var body = "";
	var group = ''
	var headers = [];

	var generator = new Generator(backends);

	body += '<ul class="resources">\n';

	var paths = Object.keys(routes);
	for (var i = 0, len = paths.length; i < len; i++) {
		var route = routes[paths[i]];
		route.path = paths[i];

		if (route.group != group) {
			group = route.group
			var header = new Header("h2", group)
			headers.push(header);
			body += "\n";
			body += `<li id="resource-${header.anchor}" class="resource">\n`;
			body += "\n";
			body += header.resourceHtml() + "\n"
			body += "\n";
			body += `<ul id="routes-${header.anchor}" class="routes">\n`;
		}

		var type = NgindoxUtil.routeType(route);

		body += `<li class="route route-type-${type.toLowerCase()}">\n`;

		// Route Type/Path/Description
		body += '<div class="heading">\n';
		body += '<h3>\n';
		body += `<span class="route-type">${RouteTypeNames[type]}</span>\n`;
		body += `<span class="route-path">${renderHtml('`' + route.path + '`')}</span>\n`;
		body += "</h3>\n";
		if (route.description) {
			body += `<span class="route-desc">${route.description}</span>\n`;
		}
		body += '</div>\n';

		// Route Metadata
		var typeKeys = Object.keys(RouteFieldNames);
		if (hasAtLeastOne(route, typeKeys)) {
			body += '<div class="route-meta" style="display:none">\n';

			// figure out which metadata fields to display
			var foundTypeKeys = [];
			for (var j = 0, jlen = typeKeys.length; j < jlen; j++) {
				var typeKey = typeKeys[j];
				var value = route[typeKey];
				if (value) {
					foundTypeKeys.push(typeKey);
				}
			}

			if (foundTypeKeys.length > 1) {
				// multi-field display mode
				var table = [];
				for (var j = 0, jlen = foundTypeKeys.length; j < jlen; j++) {
					var typeKey = foundTypeKeys[j];
					var value = route[typeKey];

					//body += `<h4>${RouteFieldNames[typeKey]}</h4>\n`;

					// any metadata typeKey value may be an array (ex: Rewrite, Redirect)
					if (Array.isArray(value)) {
						for (var k = 0, klen = value.length; k < klen; k++) {
							table.push([RouteFieldNames[typeKey] + ':', generator[typeKey](value[k])]);
							//body += generator[typeKey](value[k]);
						}
					} else if (value) {
						table.push([RouteFieldNames[typeKey] + ':', generator[typeKey](value)]);
						//body += generator[typeKey](value);
					}

				}

				body += tableToHtml(table);

			} else {
				// single-field display mode
				var typeKey = foundTypeKeys[0];
				var value = route[typeKey];

				if (Array.isArray(value)) {
					for (var k = 0, klen = value.length; k < klen; k++) {
						body += generator[typeKey](value[k]);
					}
				} else if (value) {
					body += generator[typeKey](value);
				}
			}

			body += "</div>\n";
		}

		body += "</li>\n";

		if (i+1 == len || routes[paths[i+1]].group != group) {
			body += "</ul>\n";
			body += "</li>\n";
		}
	}

	body += '</ul>';

	var prefix = "";

	if (formatConfig.css) {
		prefix += "<style>\n";
		prefix += singleTrailingNewline(NgindoxUtil.indentBlock(formatConfig.css, "  "));
		prefix += "</style>\n";
		prefix += "\n";
	}

	if (formatConfig.javascript) {
		prefix += '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.0/jquery.min.js" integrity="sha256-JAW99MJVpJBGcbzEuXk4Az05s/XyDdBomFqNlM3ic+I=" crossorigin="anonymous"></script>\n'

		prefix += "<script>\n";
		prefix += singleTrailingNewline(NgindoxUtil.indentBlock(formatConfig.javascript, "  "));
		prefix += "</script>\n";
		prefix += "\n";
	}

	if (formatConfig.title) {
		prefix += (new Header("h1", formatConfig.title)).titleHtml() + "\n"
		prefix += "\n";
	}

	if (formatConfig.legend) {
		var legend = '';
		legend += '<div class="legend">';

		legend += '<div class="heading">';
		legend += (new Header("h2", "Legend")).legendHtml() + "\n"
		legend += '</div>';
		legend += '<ul>\n';

		// only show the types used by this set of routes
		var types = NgindoxUtil.routeTypes(routes);

		for (var i = 0, len = types.length; i < len; i++) {
			var type = types[i];
			legend += `<li class="route route-type-${type}">`;
			legend += `<input type="checkbox" data-type="${type}" checked="checked">`;
			legend += '<label class="heading">';
			legend += `<span class="route-type toggle-route-type">${RouteTypeNames[type]}</span>`;
			legend += `<span class="route-desc">${RouteTypeDescriptions[type]}</span>`;
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

function tableToHtml(table) {
	var html = '';
	html += "<table>\n";
	for (var i = 0, len = table.length; i < len; i++) {
		var row = table[i];
		html += "<tr>\n";
		for (var j = 0, jlen = row.length; j < jlen; j++) {
			var column = row[j];
			html += "<td>\n";
			html += column + "\n";
			html += "</td>\n";
		}
		html += "</tr>\n";
	}
	html += "</table>\n";
	return html;
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


function renderHtml(markdown) {
	var md = new MarkdownIt({
		html: true
	});
	return md.renderInline(markdown);
}

exports.toHtml = toHtml;
