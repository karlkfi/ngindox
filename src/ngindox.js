var NginxConf = require('nginx-conf'),
	_config = require('./config'),
	util = require('util'),
	YAML = require('yamljs');

function Ngindox() {

}

Ngindox.prototype.parse = function(source, callback) {
	NginxConf.parse(source, function(err, src) {
		if (err) {
			callback(err);
			return;
		}

		var _https = findChild('http', src);
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
				new _config.Upstream(
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

			// metadata is optional
			var metadata = parseMetadata(_location);

			locations.push(
				new _config.Location(
					_location.value,
					proxy_pass,
					alias,
					metadata
				)
			);
		}

		// TODO: parse base file name

		var config = new _config.Config()
		config.upstreams = upstreams;
		config.locations = locations;

		callback(err, config);
	});
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

function parseMetadata(node) {
	return YAML.parse(node.comments.join("\n"));
}

exports.Ngindox = Ngindox;
exports.parse = function(source, callback) {
	new Ngindox().parse(source, callback);
};
