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

var TypeFields = {
	'proxy': 'proxy',
	'file': 'file',
	'lua': 'lua',
	'redirects': 'redirect',
	'rewrites': 'rewrite',
	'unknown': 'unknown'
};

// Get the type of a route
function routeType(route) {
	var fields = Object.keys(TypeFields);
	for (var i = 0, len = fields.length; i < len; i++) {
		var field = fields[i];
		if (route[field]) {
			return TypeFields[field];
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

	// Use TypeFields ordering
	var typeList = [];
	var fields = Object.keys(TypeFields);
	for (var i = 0, len = fields.length; i < len; i++) {
		var type = TypeFields[fields[i]];
		if (typeSet[type]) {
			typeList.push(type)
		}
	}

	return typeList;
}

exports.TypeFields = TypeFields;
exports.routeType = routeType;
exports.routeTypes = routeTypes;
