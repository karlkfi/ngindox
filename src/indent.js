
// Indent all lines, then truncate lines that are all spaces
function indentBlock(text, indent) {
	return text.replace(/^/gm, indent).replace(/^\s+$/gm, '');
}

exports.indentBlock = indentBlock;
