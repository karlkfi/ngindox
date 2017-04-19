var fs = require('fs'),
	Yaml = require('js-yaml');

// Parses a Yaml file string into an Ngindox object
function parse(fileString, callback) {
	try {
		return callback(null, Yaml.safeLoad(fileString));
	} catch (err) {
		return callback(err);
	}
}

// Parses a Yaml file into an Ngindox object
function parseFile(filePath, encoding, callback) {
	fs.readFile(filePath, encoding, function(err, fileString) {
		if (err) {
			return callback(err);
		}
		return parse(fileString, callback);
	});
}

// Writes a Ngindox object to a Yaml file string
function write(ngindoxMap, callback) {
	try {
		return callback(null, Yaml.safeDump(ngindoxMap));
	} catch (err) {
		return callback(err);
	}
}

// Writes a Ngindox object to a Yaml file
function writeFile(ngindoxObj, encoding, callback) {
	fs.writeFile(filePath, fileString, encoding, function(err) {
		if (err) {
			return callback(err);
		}
		return write(ngindoxObj, callback);
	});
}

exports.parse = parse;
exports.parseFile = parseFile;
exports.write = write;
exports.writeFile = writeFile;
