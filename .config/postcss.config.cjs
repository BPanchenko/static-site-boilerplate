const path = require('node:path')

const { dirs, root } = require("./workspace.config.cjs")

module.exports = {
	root,
	input: [
		path.join(dirs.stylesheets, 'document.css'),
		path.join(dirs.stylesheets, 'main.css')
	],
	output: path.join(dirs.dist, dirs.bundles),
	...require("@bpanchenko/uikit/postcss.config")
}
