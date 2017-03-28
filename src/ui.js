var MarkdownIt = require('markdown-it'),
	GithubSlugger = require('github-slugger'),
	indentBlock = require('./indent').indentBlock,
	Ngindox = require('./ngindox'),
	innertext = require('innertext'),
	singleTrailingNewline = require('single-trailing-newline'),
	removeTrailingSpaces = require("remove-trailing-spaces"),
	pretty = require('pretty');

var DisplayFields = {
	'redirects': 'Redirect',
	'rewrites': 'Rewrite',
	'proxy': 'Proxy',
	'file': 'File',
	'lua': 'Lua',
	'cache': 'Cache',
	'deprecated': 'Deprecated'
}

var DisplayTypes = {
	'proxy': 'Proxy',
	'file': 'File',
	'lua': 'Lua',
	'redirect': 'Redirect',
	'rewrite': 'Rewrite',
	'unknown': 'Unknown'
}

var RouteTypeDescription = {
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
	var markdown = "Regex: `" + field.regex + "`";
	markdown += "<br/>Replacement: `" + field.replacement + "`";
	markdown += "<br/>Type: `" + field.type + "`";
	return renderHtml(markdown);
};

Generator.prototype.rewrites = function(field) {
	var markdown = "Regex: `" + field.regex + "`";
	markdown += "<br/>Replacement: `" + field.replacement + "`";
	markdown += "<br/>Type: `" + field.type + "`";
	return renderHtml(markdown);
};

Generator.prototype.proxy = function(field) {
	var markdown = "Path: `" + field.path + "`";
	if (field.backend) {
		var backend = this.backends[field.backend];
		if (backend) {
			markdown += "<br/>Server: `" + backend.server + "`";
			if (backend.name) {
				markdown += `<br/>Backend: ${backend.name}`
			} else {
				markdown += `<br/>Backend: ${field.backend}`;
			}
			if (backend.reference) {
				markdown += `<br/>API Reference: <${backend.reference}>`
			}
		} else {
			markdown += `<br/>Backend: ${field.backend}`;
		}
	}
	return renderHtml(markdown);
};

Generator.prototype.file = function(field) {
	return renderHtml('`' + field + '`');
};

Generator.prototype.lua = function(field) {
	var markdown = '';
	if (field.file) {
		markdown += "File: `" + field.file + "`";
	} else if (field.inline) {
		markdown += "Inline";
	}
	return renderHtml(markdown);
};

/*
Generator.prototype.cache = function(field) {
	return '';
};

Generator.prototype.deprecated = function(field) {
	return '';
};
*/



function toHtml(ngindox, formatConfig) {
	formatConfig = formatConfig || {};

	var backends = ngindox.backends;
	var routes = ngindox.routes;

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

		var type = Ngindox.routeType(route);

		body += `<li class="route route-type-${type.toLowerCase()}">\n`;

		// Route Type/Path/Description
		body += '<div class="heading">\n';
		body += '<h3>\n';
		body += `<span class="route-type">${DisplayTypes[type]}</span>\n`;
		body += `<span class="route-path">${renderHtml('`' + route.path + '`')}</span>\n`;
		body += "</h3>\n";
		if (route.description) {
			body += `<span class="route-desc">${route.description}</span>\n`;
		}
		body += '</div>\n';

		// Route Metadata
		var displayFieldKeys = Object.keys(DisplayFields);
		if (hasAtLeastOne(route, displayFieldKeys)) {
			body += '<div class="route-meta" style="display:none">\n';
			body += "<table>\n";
			for (var j = 0, jlen = displayFieldKeys.length; j < jlen; j++) {
				var field = displayFieldKeys[j];
				var value = route[field];
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
					body += DisplayFields[field] + ":\n";
					body += "</td>\n";
					body += "<td>\n";
					body += generator[field](entry) + "\n";
					body += "</td>\n";
					body += "</tr>\n";
				}
			}
			body += "</table>\n";
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

	if (formatConfig.legend) {
		var legend = '';
		legend += '<div class="legend">';

		legend += '<div class="heading">';
		legend += (new Header("h2", "Legend")).legendHtml() + "\n"
		legend += '</div>';
		legend += '<ul>\n';

		// only show the types used by this set of routes
		var types = Ngindox.routeTypes(routes);

		for (var i = 0, len = types.length; i < len; i++) {
			var type = types[i];
			legend += `<li class="route route-type-${type}">`;
			legend += `<input type="checkbox" data-type="${type}" checked="checked">`;
			legend += '<label class="heading">';
			legend += `<span class="route-type toggle-route-type">${DisplayTypes[type]}</span>`;
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
