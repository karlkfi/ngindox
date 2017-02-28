var NginxConf = require('nginx-conf'),
	_config = require('./config'),
	util = require('util');

function Ngindox() {

}

Ngindox.prototype.parse = function(source, callback) {
	NginxConf.parse(source, function(err, src) {
		if (err) {
			callback(err);
			return;
		}

		var _https = find('http', src);
		if (_https.length == 0) {
			callback('Directive not found: http');
			return;
		}

		var _http = _https[0];

		var _upstreams = find('upstream', _http);
		if (_upstreams.length == 0) {
			callback('Directive not found: http.upstream');
			return;
		}

		var upstreams = [];

		for (var i = 0, len = _upstreams.length; i < len; i++) {
			var _upstream = _upstreams[i];
			
			var _servers = find('server', _upstream);
			if (_servers.length == 0) {
				callback('Directive not found: http.upstream[' + _upstream.value + '].server');
				return;
			}
			
			upstreams.push(
				new _config.Upstream(
					_upstream.value,
					_servers[0].value
				)
			);
		}

		var _servers = find('server', _http);
		if (_servers.length == 0) {
			callback('Directive not found: http.server');
			return;
		}
		
		var _server = _servers[0];
		
		var _locations = find('location', _server);
		if (_locations.length == 0) {
			callback('Directive not found: http.server.location');
			return;
		}

		var locations = [];

		for (var i = 0, len = _locations.length; i < len; i++) {
			var _location = _locations[i];

			// proxy_pass is optional
			var _proxy_passes = find('proxy_pass', _location);
            if (_proxy_passes.length == 0) {
            	locations.push(
                	new _config.Location(
                		_location.value
                	)
                );
            } else {
            	locations.push(
                	new _config.Location(
                		_location.value,
                		_proxy_passes[0].value
                	)
                );
            }
		}

		// TODO: parse base file name

		var config = new _config.Config()
		config.upstreams = upstreams;
		config.locations = locations;

		callback(err, config);
	});
}

function find(name, node) {
	var results = [];
	for (var i = 0, len = node.children.length; i < len; i++) {
		var child = node.children[i];
		if (child.name == name) {
			results.push(child);
		}
	}
	return results;
}

exports.Ngindox = Ngindox;
exports.parse = function(source, callback) {
	new Ngindox().parse(source, callback);
};