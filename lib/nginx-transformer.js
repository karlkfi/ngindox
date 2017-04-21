var NgindoxUtil = require('./util');

// Transforms Nginx.Config object into an Ngindox object
function fromNginxConfig(nginxConfig) {

	var upstreams = nginxConfig.upstreams;
	var locations = nginxConfig.locations;
	var root = nginxConfig.root;

	// sort upstreams by id
	// yaml dump uses the map insert/iterate order
	upstreams.sort(function(a, b) {
		if (a.id > b.id) {
			return 1;
		}
		if (a.id < b.id) {
			return -1;
		}
		return 0;
	});

	var backends = {};

	// transform upstreams into backends
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		var backend = {};

		//backend['id'] = upstream.id;
		backend['server'] = upstream.server;

		if (upstream.metadata.Name) {
			backend['name'] = upstream.metadata.Name;
		}

		if (upstream.metadata.Reference) {
			backend['reference'] = upstream.metadata.Reference;
		}

		// index by upstream id
		var id = upstream.id;
		backends[id] = backend;
	}

	var proxyTransformer = new ProxyTransformer(upstreams);

	// append root as location
	if (root) {
		locations.push(root);
	}

	var routes = {};

	// transform locations into routes
	for (var i = 0, len = locations.length; i < len; i++) {
		var location = locations[i];

		var route = {};

		// default (replaced by member of RouteFields)
		route['group'] = 'Other';

		route['matcher'] = transformMatcher(location.path);

		Object.keys(NgindoxUtil.RouteFields).forEach(function(key) {
			var value = NgindoxUtil.RouteFields[key];
			if (location.metadata[value]) {
				route[key] = location.metadata[value];
			}
		});

		Object.keys(NgindoxUtil.RouteMetaFields).forEach(function(key) {
			var value = NgindoxUtil.RouteMetaFields[key];
			if (location.metadata[value]) {
				route[key] = location.metadata[value];
			}
		});

		if (location.proxyPass) {
			var proxy = proxyTransformer.transform(location.proxyPass, location.path);
			if (proxy) {
				route['proxy'] = proxy;
			}
		}

		if (location.alias) {
			route['file'] = location.alias;
		}

		if (location.lua) {
			route['lua'] = {
				'inline': true
			};
		}

		if (location.luaFile) {
			route['lua'] = {
				'file': location.luaFile
			};
		}

		if (location.rewrites) {
			var rewrites = transformRewrites(location.rewrites);
			if (rewrites.length > 0) {
				route['rewrites'] = rewrites;
			}
			var redirects = transformRedirects(location.rewrites);
			if (redirects.length > 0) {
				route['redirects'] = redirects;
			}
		}

		// index by path
		var path = transformPath(location.path);
		routes[path] = route;
	}

	// sort route map
	// yaml dump uses the map insert/iterate order
	routes = toRouteMap(toRouteList(routes));

	return {
		'ngindox': '0.1.0',
		'backends': backends,
		'routes': routes
	};
}

function isRedirect(rewriteFlag) {
	return (rewriteFlag == "redirect" || rewriteFlag == "permanent");
}

function transformRewrites(rewrites) {
	var result = [];
	for (var i = 0, len = rewrites.length; i < len; i++) {
		var rewrite = rewrites[i];
		if (!isRedirect(rewrite.flag)) {
			result.push(transformRewrite(rewrite));
		}
	}
	return result;
}

function transformRedirects(rewrites) {
	var result = [];
	for (var i = 0, len = rewrites.length; i < len; i++) {
		var rewrite = rewrites[i];
		if (isRedirect(rewrite.flag)) {
			result.push(transformRewrite(rewrite));
		}
	}
	return result;
}

function transformRewrite(rewrite) {
	return {
		'regex': rewrite.regex,
		'replacement': rewrite.replacement,
		'type': rewrite.flag,
	};
}

function transformMatcher(path) {
	var pathArgs = path.split(' ');
	var matcher = 'path'; // default
	if (pathArgs.length > 1) {
		if (pathArgs[0] == "=") {
			matcher = 'exact';
		} else if (pathArgs[0] == "~") {
			matcher = 'regex';
		}
	}
	return matcher;
}

function transformPath(path) {
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
	return path;
}

// Transforms route list into a map of routes indexed by path.
function toRouteMap(routeList) {
	var routeMap = {};
	for (var i = 0, len = routeList.length; i < len; i++) {
		var route = routeList[i];
		routeMap[route['path']] = route;
	}
	return routeMap;
}

// Transforms route map into a list of routes sorted by group/path.
// Route 'path' will be injected into each route.
function toRouteList(routeMap) {
	var routeList = [];

	var root;

	// exclude root from sorting
	if (routeMap['/']) {
		root = routeMap['/'];
		root['path'] = '/';
		routeMap['/'] = null; //todo: map remove method?
	}

	var paths = Object.keys(routeMap);

	for (var i = 0, len = paths.length; i < len; i++) {
		var path = paths[i];
		if (path == '/') {
			continue;
		}
		var route = routeMap[path];
		route['path'] = path;
		routeList.push(route);
	}

	routeList.sort(function(a, b) {
		if (a['group'] < b['group']) {
			return -1;
		}
		if (a['group'] > b['group']) {
			return 1;
		}
		if (a['path'] < b['path']) {
			return -1;
		}
		if (a['path'] > b['path']) {
			return 1;
		}
		return 0;
	});

	// put root at the top
	if (root) {
		routeList.unshift(root);
	}

	return routeList;
}


function ProxyTransformer(upstreams) {
	// sort upstreams by id (backwards)
	// allows longer ids to be matched first using findUpstream
	// ex: mesos_dns & mesos
	upstreams.sort(function(a, b) {
		if (a.id > b.id) {
			return -1;
		}
		if (a.id < b.id) {
			return 1;
		}
		return 0;
	});
	this.upstreams = upstreams;
}

ProxyTransformer.prototype.transform = function(proxyPass, path) {
	return this.findUpstream(proxyPass, path, function(upstream, proxy) {
		var result = {};
		if (!upstream) {
			result['path'] = proxyPass;
			return result;
		}

		result['path'] = proxy;
		result['backend'] = upstream.id;
		return result;
	});
}

// Find the Upstream that matches a Location's ProxyPass
// and merge the ProxyPass with the Upstream Server into a "Proxy".
// return callback(upstream, proxy) if found.
// return callback() if not found.
ProxyTransformer.prototype.findUpstream = function(proxyPass, path, callback) {
	var upstreams = this.upstreams;
	for (var i = 0, len = upstreams.length; i < len; i++) {
		var upstream = upstreams[i];
		var matches = proxyPass.match("^(https?://)" + upstream.id + "(.*)$");
		if (matches) {
			var scheme = matches[1];
			var proxyPath = matches[2];
			var proxy = scheme + '$backend' + proxyPath;

			matches = upstream.server.match("^unix:(.*)$");
			if (matches) {
				proxy = scheme + '$backend';

			} else if (!proxyPath) {
				// if proxyPath is empty and server isn't a socket...
				// pass path to upstream server
				// TODO: indicate that path is pre-processed/unescaped?
				// TODO: what if path is regex? doesn't start with slash?
				// TODO: handle the path being processed by rewrites?
				proxy += path;
			}

			return callback(upstream, proxy);
		}
	}
	return callback();
}

exports.fromNginxConfig = fromNginxConfig;
