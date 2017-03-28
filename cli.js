#!/usr/bin/env node

var cli = require('cli'),
	fs = require('fs'),
	NginxParser = require('./src/nginx/parser'),
	NginxTransformer = require('./src/nginx/transformer'),
	NgindoxParser = require('./src/parser'),
	UiHtml = require('./src/ui'),
	Yaml = require('js-yaml');

cli.parse({
    file: [ 'f', 'Path to NGINX config file to parse', 'file'],
    css: [ 'c', 'Path to CSS file to include', 'file', 'include/ngindox.css'],
    javascript: [ 'j', 'Path to JS file to include', 'file', 'include/ngindox.js'],
    encoding: [ 'e', 'File encoding', 'string', 'utf8'],
    title: [ 't', 'Page title', 'string', 'Routes' ],
    legend: [ 'l', 'Route type legend', 'boolean', true ]
});

cli.parse(
	{
		// universal options
		file: [ 'f', 'Path to input file', 'file'],
		encoding: [ 'e', 'File encoding', 'string', 'utf8'],
		// ui options
		css: [ 'c', 'Path to CSS file to include', 'file', 'include/ngindox.css'],
		javascript: [ 'j', 'Path to JS file to include', 'file', 'include/ngindox.js'],
		title: [ 't', 'Page title', 'string', 'Routes' ],
		legend: [ 'l', 'Route type legend', 'boolean', true ]
	},
	[
		'parse',
		'ui'
	]
);

var handlers = {};

handlers.parse = function(cli, args, options) {
	if (options.file) {
		NginxParser.parseFile(options.file, options.encoding, function(err, config) {
			if (err) {
				return cli.fatal(err);
			}

			process.stdout.write(
				Yaml.safeDump(NginxTransformer.transform(config))
			);
		});
	} else {
		cli.withStdin(options.encoding, function(fileString) {
			NginxParser.parse(fileString, function(err, config) {
				if (err) {
					return cli.fatal(err);
				}

				process.stdout.write(
					Yaml.safeDump(NginxTransformer.transform(config))
				);
			});
		});
	}
};

handlers.ui = function(cli, args, options) {
	var css = '';
	if (options.css) {
		try {
			css = fs.readFileSync(options.css, options.encoding);
		} catch (err) {
			return cli.fatal(err);
		}
	}

	var javascript = '';
	if (options.javascript) {
		try {
			javascript = fs.readFileSync(options.javascript, options.encoding);
		} catch (err) {
			return cli.fatal(err);
		}
	}

	if (options.file) {
		NgindoxParser.parseFile(options.file, options.encoding, function(err, ngindox) {
			if (err) {
				return cli.fatal(err);
			}

			process.stdout.write(
				UiHtml.toHtml(ngindox, {
					'css': css,
					'javascript': javascript,
					'title': options.title,
					'legend': options.legend
				})
			);
		});
	} else {
		cli.withStdin(options.encoding, function(fileString) {
			NgindoxParser.parse(fileString, function(err, ngindox) {
				if (err) {
					return cli.fatal(err);
				}

				process.stdout.write(
					UiHtml.toHtml(ngindox, {
						'css': css,
						'javascript': javascript,
						'title': options.title,
						'legend': options.legend
					})
				);
			});
		});
	}
};

cli.main(function (args, options) {
	var handler = handlers[this.command];
	if (!handler) {
		return this.fatal(`Missing command handler (${this.command})`);
	}

	return handler(this, args, options);
});
