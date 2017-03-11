#!/usr/bin/env node

var cli = require('cli'),
	fs = require('fs'),
	ngindox = require('./src/ngindox');

cli.parse({
    file: [ 'f', 'Path to NGINX config file to parse', 'file'],
    css: [ 'c', 'Path to CSS file to include', 'file', 'include/ngindox.css'],
    javascript: [ 'j', 'Path to JS file to include', 'file', 'include/ngindox.js'],
    encoding: [ 'e', 'File encoding', 'string', 'utf8'],
    title: [ 't', 'Page title', 'string']
});

cli.main(function (args, options) {
	var fatal = this.fatal;

	if (!options.file) {
		return fatal('Must specify input file (-f)');
	}

	var css = '';
	if (options.css) {
		try {
			css = fs.readFileSync(options.css, options.encoding);
		} catch (err) {
			return fatal(err);
		}
	}

	var javascript = '';
    if (options.javascript) {
    	try {
    		javascript = fs.readFileSync(options.javascript, options.encoding);
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
				css: css,
				javascript: javascript,
			})
		);
	});
});
