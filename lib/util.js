/*
"routes": {
	"path": {
		"matcher: "exact|regex|path"
		"group": "string",
		"description": "string",
		"file": {
			"path": "string"
		}
		"proxy": {
			"path": "string"
		},
		"lua": {
			"path": "string",
			"inline": "string"
		},
		"redirect": {
			"regex": "string",
			"replacement": "string",
			"type": "temporary|permanent"
		},
		"rewrite": {
			"regex": "string",
			"replacement": "string",
			"type": "last|break"
		}
	}
}
*/

var RouteTypeFields = {
	'proxy': 'proxy',
	'file': 'file',
	'lua': 'lua',
	'redirects': 'redirect',
	'rewrites': 'rewrite',
	'unknown': 'unknown'
};

var RouteFields = {
	'group': 'Group',
	'description': 'Description',
	'visibility': 'Visibility'
};

var RouteMetaFields = {
	'cache': 'Cache',
	'deprecated': 'Deprecated'
};

// Get the type of a route
function routeType(route) {
	var fields = Object.keys(RouteTypeFields);
	for (var i = 0, len = fields.length; i < len; i++) {
		var field = fields[i];
		if (route[field]) {
			return RouteTypeFields[field];
		}
	}
	return 'unknown';
}

// Get a list of route types found in the provided route map, in canonical order
function routeTypes(routeMap) {
	var typeSet = {};

	var keys = Object.keys(routeMap);
	for (var i = 0, len = keys.length; i < len; i++) {
		var route = routeMap[keys[i]];
		var type = routeType(route);
		typeSet[type] = true;
	}

	// Use RouteTypeFields ordering
	var typeList = [];
	var fields = Object.keys(RouteTypeFields);
	for (var i = 0, len = fields.length; i < len; i++) {
		var type = RouteTypeFields[fields[i]];
		if (typeSet[type]) {
			typeList.push(type)
		}
	}

	return typeList;
}

// Indent all lines, then truncate lines that are all spaces
function indentBlock(text, indent) {
	return text.replace(/^/gm, indent).replace(/^\s+$/gm, '');
}

exports.RouteTypeFields = RouteTypeFields;
exports.RouteFields = RouteFields;
exports.RouteMetaFields = RouteMetaFields;
exports.routeType = routeType;
exports.routeTypes = routeTypes;
exports.indentBlock = indentBlock;
