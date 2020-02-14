const path = require('node:path')

const { dirs } = require("./workspace.config.cjs")
const { checkDevelopmentMode } = require("../.kernel/lib.cjs")

module.exports = {
	input: path.join(dirs.scripts, 'main.js'),
	output: {
		sourcemap: checkDevelopmentMode(),
		format: 'esm',
		file: path.join(dirs.dist, dirs.bundles, 'core.mjs')
	},
	plugins: [
		require("@rollup/plugin-node-resolve").nodeResolve(),
		require("@rollup/plugin-terser")()
	]
}
