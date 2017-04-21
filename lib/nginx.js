var NgindoxUtil = require('./util'),
	NginxConf = require('nginx-conf'),
	Yaml = require('js-yaml'),
	fs = require('fs'),
	path = require('path'),
	singleTrailingNewline = require('single-trailing-newline');

// Parses a file string into an Nginx Config object.
// Does not expand file includes.
function parse(fileString, callback) {
	return NginxConf.parse(fileString, function(err, _config) {
		if (err) {
			return callback(err);
		}

		return parseNginxConf(_config, callback);
	});
}

// Reads and parses a file into an Nginx Config object
// Expands file includes.
function parseFile(filePath, encoding, callback) {
	return fs.readFile(filePath, encoding, function(err, fileString) {
		if (err) {
			return callback(err);
		}

		fileString = expandIncludes(fileString, path.dirname(filePath));

		return parse(fileString, callback);
	});
}

// Expands relative includes (preserves indentation).
// Absolute includes are ignored.
// TODO: rewrite to use callback?
function expandIncludes(source, rootPath) {
	var matcher = new RegExp("^([\t ]*)include ([^/].*);\n?", "gm");
	var match;
	var expanded = '';
	var after = source;
	var includes = [];
	var lastIndex = 0;
	while (match = matcher.exec(source)) {
		var statement = match[0];
		var indent = match[1];
		var filePath = path.join(rootPath, match[2])
		includes.push(filePath);

		expanded += source.substr(lastIndex, match.index - lastIndex);

		expanded += indent + "## Start Include: " + filePath + "\n";

		try {
			var fileContent = fs.readFileSync(filePath, 'utf8');

			// preserve indentation of the include line
			var indentedContent = singleTrailingNewline(NgindoxUtil.indentBlock(fileContent, indent));

			// recurse with relative path
			expanded += expandIncludes(indentedContent, path.dirname(rootPath));
		} catch (err) {
			// file probably missing
			expanded += indent + "## Error: " + err + "\n";
		}

		expanded += indent + "## End Include: " + filePath + "\n";

		// store end of match as begining of next search
		lastIndex = matcher.lastIndex;
	}

	expanded += source.substr(lastIndex);

	return expanded;
}

// Input: NginxConf (object)
// Callback: error (string), Config (object)
function parseNginxConf(_config, callback) {
	var _https = findChild('http', _config);
	if (_https.length == 0) {
		callback('Directive not found: http');
		return;
	}

	var _http = _https[0];

	var _upstreams = findChild('upstream', _http);
	if (_upstreams.length == 0) {
		callback('Directive not found: http.upstream');
		return;
	}

	var upstreams = [];

	for (var i = 0, len = _upstreams.length; i < len; i++) {
		var _upstream = _upstreams[i];

		// server is required
		var _servers = findChild('server', _upstream);
		if (_servers.length == 0) {
			callback('Directive not found: http.upstream[' + _upstream.value + '].server');
			return;
		}

		// metadata is optional
		var metadata = parseMetadata(_upstream);

		upstreams.push(
			new Upstream(
				_upstream.value,
				_servers[0].value,
				metadata
			)
		);
	}

	var _servers = findChild('server', _http);
	if (_servers.length == 0) {
		callback('Directive not found: http.server');
		return;
	}

	var _server = _servers[0];

	var root = null;

	var _roots = findChild('root', _server);
	// root is optional
	if (_roots.length > 0) {
		var _root = _roots[0];

		// root metadata is optional
		var metadata = parseMetadata(_root);

		root = new Location('/', metadata);
		root.alias = _root.value;
	}

	var _locations = findChild('location', _server);
	if (_locations.length == 0) {
		callback('Directive not found: http.server.location');
		return;
	}

	var locations = [];

	for (var i = 0, len = _locations.length; i < len; i++) {
		var _location = _locations[i];

		// proxy_pass is optional
		var proxy_pass = ''
		var _proxy_passes = findChild('proxy_pass', _location);
		if (_proxy_passes.length > 0) {
			proxy_pass = _proxy_passes[0].value;
		}

		// alias is optional
		var alias = ''
		var _aliases = findChild('alias', _location);
		if (_aliases.length > 0) {
			alias = _aliases[0].value;
		}

		// rewrite is optional
		var rewrites = [];
		var _rewrites = findChild('rewrite', _location);
		for (var j = 0, lenj = _rewrites.length; j < lenj; j++) {
			rewrites.push(parseRewrite(_rewrites[j].value))
		}

		// content_by_lua is optional
		var lua = '';
		var _luas = findChild('content_by_lua', _location);
		if (_luas.length > 0) {
			lua = _luas[0].value;
		}

		// content_by_lua_file is optional
		var luaFile = '';
		_luaFiles = findChild('content_by_lua_file', _location);
		if (_luaFiles.length > 0) {
			luaFile = _luaFiles[0].value;
		}

		// TODO: handle if blocks

		// metadata is optional
		var metadata = parseMetadata(_location);

		var location = new Location(_location.value, metadata);
		location.proxyPass = proxy_pass;
		location.alias = alias;
		location.rewrites = rewrites;
		location.lua = lua;
		location.luaFile = luaFile;
		locations.push(location);
	}

	var config = new Config()
	config.upstreams = upstreams;
	config.locations = locations;
	config.root = root;

	callback(null, config);
}

function findChild(name, node) {
	var results = [];
	for (var i = 0, len = node.children.length; i < len; i++) {
		var child = node.children[i];
		if (child.name == name) {
			results.push(child);
		}
	}
	return results;
}

function parseRewrite(rewrite) {
	// extract optional flag
	var flag = '';
	var matches = rewrite.match("^(.+) (last|break|redirect|permanent)$");
	if (matches) {
		rewrite = matches[1];
		flag = matches[2];
	}
	var regex = '';
	var replacement = '';
	var split = splitSpaceList(rewrite);
	if (split.length == 2) {
		// no spaces in the rewrite or replacement, yay!
		regex = split[0];
		replacement = split[1];
	}

	if (!flag) {
		// default flag depends on replacement string
		if (replacement.startsWith("https?://") || replacement.startsWith("$scheme")) {
			flag = "redirect";
		}
	}

	return new Rewrite(regex, replacement, flag)
}

// Parses a list of strings delimited by whitespace, using optional double or single quote.
// TODO: handle escaped quotes within quoted segments? Does nginx allow spaces in the regex or replacement?
function splitSpaceList(source) {
	var segments = [];
	var matcher = new RegExp("\"([^\"]*)\"|'([^']*)'|(\\S+)", "g");
	var match;
	while (match = matcher.exec(source)) {
		if (match[1] != null) {
			segments.push(match[1]);
		} else if (match[2] != null) {
			segments.push(match[2]);
		} else {
			segments.push(match[3]);
		}
	}
	return segments;
}

function parseMetadata(node) {
	// Find last YAML file delimiter in the comment, if present
	var start = 0;
	for (var i = node.comments.length-1; i >= 0; i--) {
		var line = node.comments[i];
		if (line.trim() == '---') {
			start = i+1;
			break;
		}
	}
	// start metadata at the last YAML delimiter or at the beginning of the comment
	var commentString = node.comments.slice(start, node.comments.length).join("\n");
	try {
		return Yaml.safeLoad(commentString);
	} catch (err) {
		var NestedError = require('nested-error-stacks');
		throw new NestedError("MetadataException: non-YAML metadata comment:\n" + NgindoxUtil.indentBlock(commentString, '    #'), err);
	}
}

function Config() {
	this.upstreams = [];
	this.locations = [];
	this.root = null;
}

function Upstream(id, server, metadata) {
	this.id = id || '';
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

function Rewrite(regex, replacement, flag) {
	this.regex = regex || '';
	this.replacement = replacement || '';
	this.flag = flag || '';
}

exports.Config = Config;
exports.Upstream = Upstream;
exports.Location = Location;
exports.Rewrite = Rewrite;

exports.parse = parse;
exports.parseFile = parseFile;
