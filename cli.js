#!/usr/bin/env node

var cli = require('cli'),
	fs = require('fs'),
	ngindox = require('./src/ngindox');

cli.parse({
    file: [ 'f', 'Path to NGINX config file to parse', 'file'],
    encoding: [ 'e', 'File encoding', 'string', 'utf8'],
    title: [ 't', 'Page title', 'string', 'Locations']
});

cli.main(function (args, options) {
	var fatal = this.fatal;

	if (!options.file) {
		return fatal('Must specify input file (-f)');
	}

    ngindox.parseFile(options.file, options.encoding, function(err, config) {
		if (err) {
			return fatal(err);
		}

		process.stdout.write(
			config.toMarkdown({
				title: options.title
			})
		);
	});
});
