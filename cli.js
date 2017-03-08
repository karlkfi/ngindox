#!/usr/bin/env node

var cli = require('cli'),
	fs = require('fs'),
	ngindox = require('./src/ngindox');

cli.parse({
    file: [ 'f', 'Path to NGINX config file to parse', 'file'],
    style: [ 's', 'Path to CSS file to include', 'file', 'style.css'],
    encoding: [ 'e', 'File encoding', 'string', 'utf8'],
    title: [ 't', 'Page title', 'string'],
    toc: [ 'l', 'Table of contents', 'boolean', false]
});

cli.main(function (args, options) {
	var fatal = this.fatal;

	if (!options.file) {
		return fatal('Must specify input file (-f)');
	}

	var style = '';
	if (options.style) {
		try {
			style = fs.readFileSync(options.style, options.encoding);
		} catch (err) {
			return fatal(err);
		}
	}

    ngindox.parseFile(options.file, options.encoding, function(err, config) {
		if (err) {
			return fatal(err);
		}

		process.stdout.write(
			config.toHtml({
				title: options.title,
				toc: options.toc,
				style: style
			})
		);
	});
});
