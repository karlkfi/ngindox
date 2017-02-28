var pkg = require('./package.json'),
    ngindox = require('./src/ngindox');

exports.version = pkg.version;
exports.Ngindox = ngindox.Ngindox
exports.parseFile = ngindox.parseFile
