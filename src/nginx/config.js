
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
