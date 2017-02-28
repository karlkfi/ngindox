#!/usr/bin/env node

var cli = require('cli'),
	ngindox = require('./src/ngindox');

cli.withStdin(function(input) {
	var print = this.output
	ngindox.parse(input, function(err, config) {
		if (err) {
			print("Error: " + err);
			return;
		}
		print(config.toMarkdown());
	});
});
